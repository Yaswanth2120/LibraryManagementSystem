import db from '../models/index.js';

export const getAdminStats = async (req, res) => {
  try {
    const totalBooks = await db.Book.count();
    const totalUsers = await db.User.count();
    const totalRequests = await db.BorrowRequest.count();
    const pendingRequests = await db.BorrowRequest.count({ where: { status: 'pending' } });
    const approvedRequests = await db.BorrowRequest.count({ where: { status: 'approved' } });
    const rejectedRequests = await db.BorrowRequest.count({ where: { status: 'rejected' } });

    res.json({
      totalBooks,
      totalUsers,
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};
