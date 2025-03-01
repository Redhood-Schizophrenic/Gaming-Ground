import { getRecords } from "../PbUtilityFunctions";

export async function fetchStaffReportsStats() {
  try {
    const staffs = await getRecords("users"); // Fetch all staff members
    const staff_logins = await getRecords("staff_logins"); // Fetch login records

    let data = {
      total_staff: 0,
      present_today: 0,
      onLeave_today: 0,
    };

    if (staffs?.success && staff_logins?.success) {
      // Step 1: Get date range for the current month
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Step 2: Track unique login dates per user within the current month only
      const loginHistory = new Map(); // { user_id: Set<YYYY-MM-DD> }

      staff_logins.data.forEach((log) => {
        const loginDate = new Date(log.created).toISOString().split("T")[0]; // Extract YYYY-MM-DD from created field
        const loginDateObj = new Date(loginDate);

        // Only count logins from the current month
        if (
          loginDateObj.getMonth() === today.getMonth() &&
          loginDateObj.getFullYear() === today.getFullYear() &&
          loginDateObj <= today
        ) {
          if (!loginHistory.has(log.user_id)) {
            loginHistory.set(log.user_id, new Set());
          }
          loginHistory.get(log.user_id).add(loginDate);
        }
      });

      // Step 3: Find users who logged in today
      const todayStr = today.toISOString().split("T")[0];
      const presentUsers = new Set();

      staff_logins.data.forEach((log) => {
        const loginDate = new Date(log.created).toISOString().split("T")[0];
        if (loginDate === todayStr) {
          presentUsers.add(log.user_id);
        }
      });

      // Step 4: Get all staff members
      const allUsers = new Set(staffs.data.map((staff) => staff.id));

      // Step 5: Calculate leaves and days present for each user in the current month
      const leaveCount = new Map(); // { user_id: total_leaves }
      const daysPresent = new Map(); // { user_id: days_present }

      // Calculate number of business days that have passed in the current month
      let totalBusinessDays = 0;
      for (
        let date = new Date(firstDayOfMonth);
        date <= today;
        date.setDate(date.getDate() + 1)
      ) {
        const day = date.getDay();
        // Skip weekends (0 = Sunday, 6 = Saturday)
        if (day !== 0 && day !== 6) {
          totalBusinessDays++;
        }
      }

      allUsers.forEach((user) => {
        const userLoginDates = loginHistory.get(user) || new Set();
        // Count unique days present
        daysPresent.set(user, userLoginDates.size);

        // Leaves = business days minus days present
        const userLeaves = Math.max(0, totalBusinessDays - userLoginDates.size);
        leaveCount.set(user, userLeaves);
      });

      // Step 6: Find absent users today
      const absentUsers = [...allUsers].filter((user) => !presentUsers.has(user));

      // Step 7: Attach leave count and days present to each staff member
      staffs.data = staffs.data.map((staff) => {
        // Get values directly from the maps and log them for debugging
        const leavesValue = leaveCount.get(staff.id) || 0;
        const daysValue = daysPresent.get(staff.id) || 0;
        console.log(`User ${staff.username}: leaves=${leavesValue}, days=${daysValue}`);

        return {
          ...staff,
          leaves_taken: leavesValue,
          days_present: daysValue
        };
      });

      // Step 8: Update stats
      data.total_staff = allUsers.size;
      data.present_today = presentUsers.size;
      data.onLeave_today = absentUsers.length;
    }

    return { ...data, staffs: staffs.data };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}
