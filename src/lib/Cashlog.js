import { getRecords } from "./PbUtilityFunctions";

export const getExpenses = async () => {
  try {
    const response = await getRecords('cashlog');
    let data = [];
    if (response?.success) {
      response?.data.map((item) => {
        const instance = {
          ...item,
          date: item.created,
          description: item?.withdraw_from_drawer?.description,
          author: item?.withdraw_from_drawer?.taken_by,
          amount: item?.withdraw_from_drawer?.amount
        }
        data.push(instance);
      });
    }
    return data
  } catch (error) {
    console.log(error);
  }
}
