import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: "API is working!" });
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  console.log(req.user);
};




// Analytics functions for the educational platform
async function calculateUserAnalytics() {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Basic user metrics
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: firstDayOfMonth }
    });
    const newUsersLastMonth = await User.countDocuments({
      createdAt: {
        $gte: firstDayOfLastMonth,
        $lt: firstDayOfMonth
      }
    });

    console.log("newusers", newUsersThisMonth, newUsersLastMonth);
    // Calculate growth rate
    const growthRate = newUsersLastMonth > 0 
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100 
      : 100;

    // Get class distribution
    const classDistribution = await User.aggregate([
      {
        $group: {
          _id: "$currentClass",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get exam target distribution
    const examTargetDistribution = await User.aggregate([
      {
        $unwind: "$targetExam"
      },
      {
        $group: {
          _id: "$targetExam",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get target year distribution
    const yearDistribution = await User.aggregate([
      {
        $unwind: "$targetYear"
      },
      {
        $group: {
          _id: "$targetYear",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get ebook subscription metrics
    const ebookMetrics = await User.aggregate([
      {
        $project: {
          hasSubscriptions: {
            $cond: [{ $gt: [{ $size: "$subscribedEbook" }, 0] }, 1, 0]
          },
          subscriptionCount: { $size: "$subscribedEbook" }
        }
      },
      {
        $group: {
          _id: null,
          totalSubscribedUsers: {
            $sum: "$hasSubscriptions"
          },
          totalSubscriptions: {
            $sum: "$subscriptionCount"
          }
        }
      }
    ]);

    // Get monthly growth data
    const monthlyGrowth = await getMonthlyGrowthData();

    return {
      currentMetrics: {
        totalUsers,
        newUsersThisMonth,
        newUsersLastMonth,
        growthRate: parseFloat(growthRate.toFixed(2)),
        totalSubscribedUsers: ebookMetrics[0]?.totalSubscribedUsers || 0,
        totalEbookSubscriptions: ebookMetrics[0]?.totalSubscriptions || 0,
      },
      distributions: {
        classes: classDistribution,
        examTargets: examTargetDistribution,
        targetYears: yearDistribution
      },
      monthlyGrowth
    };
  } catch (error) {
    console.error('Error calculating user analytics:', error);
    throw error;
  }
}

async function getMonthlyGrowthData(numberOfMonths = 7) {
  try {
    const monthlyData = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          newUsers: { $sum: 1 },
          subscriptionCount: {
            $sum: { $size: "$subscribedEbook" }
          }
        }
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1
        }
      },
      {
        $limit: numberOfMonths
      }
    ]);

    // Format the data for the frontend
    return monthlyData.map(data => ({
      month: new Date(data._id.year, data._id.month - 1).toLocaleString('default', { month: 'short' }),
      newUsers: data.newUsers,
      subscriptions: data.subscriptionCount
    })).reverse();
  } catch (error) {
    console.error('Error getting monthly growth data:', error);
    throw error;
  }
}

// API endpoint handler
async function getAnalytics(req, res) {
  try {
    const analytics = await calculateUserAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching analytics data' });
  }
}


export {
  calculateUserAnalytics,
  getMonthlyGrowthData,
  getAnalytics,

};