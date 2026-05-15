import axios from 'axios';

const STU_KEY = 'YOUR_API_KEY';
const STU_SECRET = 'YOUR_API_SECRET';
const BASE_URL = 'https://api.successtopup.com/api';

// ✅ Vercel এর জন্য সঠিক URL
const LOCAL_API_URL = '/api';

const operatorMap = {
  'Grameenphone': 'GP',
  'Robi': 'RB',
  'Banglalink': 'BL',
  'Airtel': 'AT',
  'Teletalk': 'TT',
  'Skitto': 'SK',
  'Brilliant': 'BT'
};

export const rechargeMobile = async (number, amount, operatorName, simType = 'prepaid', packageId = null, userEmail, password) => {
  try {
    const operatorCode = operatorMap[operatorName] || 'GP';

    const payload = {
      number,
      type: simType,
      operator: operatorCode,
      amount: parseFloat(amount),
      trxid: 'STU' + Date.now(),
      successtopup_key: STU_KEY,
      successtopup_secret: STU_SECRET
    };

    if (packageId) payload.package_id = packageId;

    const response = await axios.post(`${BASE_URL}/recharge`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data.result === true) {
      try {
        await axios.post(`${LOCAL_API_URL}/recharge`, {
          email: userEmail,
          amount: parseFloat(amount),
          password
        });
      } catch (dbError) {
        console.error("Local balance update failed:", dbError);
      }

      return {
        success: true,
        transactionId: payload.trxid,
        message: response.data.message || 'Recharge successful'
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Transaction failed'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Network Error'
    };
  }
};

export const getSTUBalance = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/balance`, {
      successtopup_key: STU_KEY,
      successtopup_secret: STU_SECRET
    });

    if (response.data.result === true) {
      return {
        success: true,
        balance: response.data.balance,
        driveBalance: response.data.driveBalance
      };
    }
    return { success: false, message: 'Failed to fetch balance' };
  } catch (error) {
    return { success: false, message: 'Balance API Error' };
  }
};