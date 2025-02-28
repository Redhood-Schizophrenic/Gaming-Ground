import pb from "./pocketbase";

// API Functions For Fetching Dashboard Data
export async function readDashboardCurrent() {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [sessions, inventory, customers, revenue] = await Promise.all([
      pb.collection('sessions').getList(1, 1, {
        filter: pb.filter('created >= {:date}', { date: today })
      }),
      pb.collection('device').getList(1, 50),
      pb.collection('customers').getList(1, 1, {
        filter: pb.filter('created >= {:date}', { date: today })
      }),
      pb.collection('sessions').getList(1, 100, {
        filter: pb.filter('created >= {:date} && status = "closed"', {
          date: today
        })
      })
    ]);

    return {
      todaySessions: sessions.totalItems,
      activeDevices: inventory.items.length,
      totalDevices: inventory.items.length,
      newCustomers: customers.totalItems,
      todayRevenue: revenue.items.reduce((acc, session) => acc + (session.total_amount || 0), 0),
      totalRewards: revenue.items.reduce((acc, session) => acc + (session.reward_points_earned || 0), 0)
    };
  } catch (error) {
    handleError(error);
  }
}

// API Functions for Session
export async function fetchSessions(page = 1, perPage = 50) {
  try {
    return await pb.collection('sessions').getList(page, perPage, {
      sort: '-created',
      expand: 'customer_id,device_id,game_id, branch_id, user_id',
      filter: pb.filter('status != "deleted"')
    });
  } catch (error) {
    handleError(error);
  }
}

export async function getGamePlayStats() {
  try {
    const sessions = await pb.collection('sessions').getList(1, 1000, {
      expand: 'game_id',
      filter: pb.filter('status != "deleted"')
    });

    const gameStats = {};

    sessions.items.forEach(session => {
      if (session.game_id && session.expand?.game_id) {
        const gameId = session.game_id;
        if (!gameStats[gameId]) {
          gameStats[gameId] = {
            name: session.expand.game_id.name || 'Unknown Game',
            plays: 0
          };
        }
        gameStats[gameId].plays += 1;
      }
    });

    const sortedStats = Object.values(gameStats)
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 10); // Get top 10 games

    return sortedStats.length > 0 ? sortedStats : [{ name: 'No Data', plays: 0 }];
  } catch (error) {
    console.error('Error fetching game stats:', error);
    return [{ name: 'No Data', plays: 0 }];
  }
}

export async function getPeakHours() {
  try {
    const sessions = await pb.collection('sessions').getList(1, 1000, {
      filter: pb.filter('created >= {:start}', {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      })
    });

    // Initialize hourly stats with proper structure
    const hourlyStats = Array.from({ length: 24 }, (_, index) => ({
      hour: index,
      sessions: 0
    }));

    // Count sessions for each hour
    sessions?.items?.forEach(session => {
      try {
        const sessionDate = new Date(session.session_in);
        if (sessionDate && !isNaN(sessionDate)) {
          const hour = sessionDate.getHours();
          if (hour >= 0 && hour < 24) {
            hourlyStats[hour].sessions += 1;
          }
        }
      } catch (error) {
        console.error('Error processing session date:', error);
      }
    });

    return hourlyStats;
  } catch (error) {
    console.error('Error fetching peak hours:', error);
    // Return empty data structure if there's an error
    return Array.from({ length: 24 }, (_, index) => ({
      hour: index,
      sessions: 0
    }));
  }
}
export async function fetchStaffLogins(page = 1, perPage = 50) {
  try {
    return await pb.collection('staff_logins').getList(page, perPage, {
      sort: '-login_time',
      expand: 'user_id,branch_id',
      filter: pb.filter('status = "active"')
    });
  } catch (error) {
    handleError(error);
  }
}

// Update the getPaymentStats function
export async function getPaymentStats() {
  try {
    const sessions = await pb.collection('sessions').getList(1, 1000, {
      filter: pb.filter('created >= {:start}', {
        start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Last 24 hours
      })
    });

    // Initialize with our two payment modes
    const paymentStats = {
      'CASH': { count: 0, total: 0 },
      'UPI': { count: 0, total: 0 }
    };

    // Process sessions
    sessions.items.forEach(session => {
      // Normalize the payment mode to uppercase and handle null/undefined
      const rawMode = (session.payment_mode || 'CASH').toUpperCase().trim();

      // Map any variations to our standard modes
      let mode = 'CASH'; // default
      if (rawMode.includes('UPI')) {
        mode = 'UPI';
      }

      // Update stats
      paymentStats[mode].count += 1;
      paymentStats[mode].total += session.total_amount || 0;
    });

    const totalTransactions = Object.values(paymentStats).reduce((sum, stat) => sum + stat.count, 0);

    // Format the results
    return Object.entries(paymentStats).map(([mode, stats]) => ({
      mode: mode === 'UPI' ? 'UPI' : 'Cash', // Format for display
      percentage: totalTransactions ? ((stats.count / totalTransactions) * 100).toFixed(1) : 0,
      amount: stats.total,
      count: stats.count
    }));
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    return [];
  }
}
