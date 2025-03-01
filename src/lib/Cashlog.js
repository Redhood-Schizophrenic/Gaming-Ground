import { getRecords } from "./PbUtilityFunctions";

export const getExpenses = async () => {
  try {
    const response = await getRecords('cashlog');
    let data = [];
    if (response?.success) {
      response?.data.forEach((item) => {
        let formattedDate = "Date unavailable";

        if (item.created) {
          try {
            // Replace space with 'T' to make it ISO 8601 compliant
            const isoDateString = item.created.replace(' ', 'T');
            const date = new Date(isoDateString);

            if (!isNaN(date.getTime())) {
              formattedDate = new Intl.DateTimeFormat("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }).format(date);
            } else {
              formattedDate = String(item.created);
            }
          } catch (e) {
            formattedDate = String(item.created);
            console.log("Error formatting date:", e);
          }
        }

        const instance = {
          ...item,
          date: formattedDate,
          description: item?.withdraw_from_drawer?.description,
          author: item?.withdraw_from_drawer?.taken_by,
          amount: item?.withdraw_from_drawer?.amount
        }
        data.push(instance);
      });
    }
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
