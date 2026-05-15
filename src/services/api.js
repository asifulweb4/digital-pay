import axios from 'axios';

// আপনার ড্যাশবোর্ড থেকে পাওয়া Key এবং Secret এখানে বসান
const STU_KEY = 'YOUR_API_KEY';
const STU_SECRET = 'YOUR_API_SECRET';
const BASE_URL = 'https://api.successtopup.com/api';
const LOCAL_API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')) + '/api'; // আপনার লোকাল বা প্রোডাকশন ব্যাকএন্ড

// অপারেটর নাম থেকে কোডে রূপান্তর
const operatorMap = {
  'Grameenphone': 'GP',
  'Robi': 'RB',
  'Banglalink': 'BL',
  'Airtel': 'AT',
  'Teletalk': 'TT',
  'Skitto': 'SK',
  'Brilliant': 'BT'
};

/**
 * মোবাইল রিচার্জ করার ফাংশন
 */
export const rechargeMobile = async (number, amount, operatorName, simType = 'prepaid', packageId = null, userEmail, password) => {
  try {
    const operatorCode = operatorMap[operatorName] || 'GP';
    
    // ১. লোকাল ব্যাকএন্ডে চেক করা (পাসওয়ার্ড ও ব্যালেন্স)
    // আমরা প্রথমে লোকাল আপডেট করতে পারি অথবা এক্সটার্নাল এপিআই এর আগে ভেরিফাই করতে পারি।
    // এখানে এক্সটার্নাল এপিআই আগে কল করা হচ্ছে, কিন্তু লোকাল ডাটাবেসেও চেক হওয়া দরকার।
    
    // ২. Success TopUp এপিআই কল
    const payload = {
      number: number,
      type: simType, 
      operator: operatorCode,
      amount: parseFloat(amount),
      trxid: 'STU' + Date.now(),
      successtopup_key: STU_KEY,
      successtopup_secret: STU_SECRET
    };

    if (packageId) {
      payload.package_id = packageId;
    }

    const response = await axios.post(`${BASE_URL}/recharge`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data.result === true) {
      // ৩. লোকাল ডাটাবেসে ব্যালেন্স কমানো
      try {
        await axios.post(`${LOCAL_API_URL}/recharge`, {
          email: userEmail,
          amount: parseFloat(amount),
          password: password
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
        message: response.data.message || 'API Error: Transaction failed'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Network Error: Could not connect to Success TopUp'
    };
  }
};

/**
 * একাউন্ট ব্যালেন্স চেক করার ফাংশন
 */
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
