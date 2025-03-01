import { PB_URL } from "../constant/url";
import { getRecords } from "../PbUtilityFunctions";

export async function fetchCustomerStats() {
  try {
    const customers = await getRecords('customers');
    const sessions = await getRecords('sessions', { expand: 'game_id' });
    let data = {
      total_customers: 0,
      active_members: 0,
      total_revenue: 0,
      max_session: 0,
      session_price: 0,
      snacks_price: 0,
      popular_games: []
    }
    console.log(sessions);
    if (customers?.success && sessions?.success) {

      // Step 1: Aggregate popularity by game_id
      const gameMap = sessions?.data?.reduce((acc, session) => {
        const game = session.expand?.game_id;
        if (!game) return acc;

        if (!acc[session.game_id]) {
          acc[session.game_id] = {
            id: session.game_id,
            name: game.name,
            popularity_score: 0,
            game_avatar: game.game_avatar,
            collectionId: game.collectionId,
            image: `${PB_URL}/api/files/${game?.collectionId}/${game?.id}/${game.game_avatar}`
          };
        }

        acc[session.game_id].popularity_score += game.popularity_score;
        return acc;
      }, {});

      // Step 2: Convert to an array and sort by popularity_score
      const sortedGames = Object.values(gameMap).sort((a, b) => b.popularity_score - a.popularity_score);

      data.total_customers = customers?.data.length;
      data.active_members = customers?.data.filter((customer) => customer?.isMember === true).length;
      data.total_revenue = sessions?.data?.reduce((acc, session) => acc + session?.amount_paid, 0);
      data.max_session = sessions?.data?.reduce((max, session) => Math.max(max, session?.duration), 0);
      data.session_price = sessions?.data?.reduce((acc, session) => acc + session?.session_amount, 0);
      data.snacks_price = sessions?.data?.reduce((acc, session) => acc + session?.snacks_price, 0);
      data.popular_games = sortedGames;
    }
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function fetchCustomerData() {
  try {
    let data = []
    const customers = await getRecords('customers');
    if (customers?.success) {
      data = customers.data;
    }
    return data;
  } catch (error) {
    console.log(error);
  }
} 
