import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET: Account statistics for dashboard
export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  // Check authentication and permissions
  if (!session?.user || !['superadmin', 'admin'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    // Get total accounts
    const totalQuery = `SELECT COUNT(*) as count FROM admin_users`;
    const totalResult = await executeQuery({ query: totalQuery });
    const total = totalResult[0].count;

    // Count by role - now directly use the DB roles
    const superadminQuery = `SELECT COUNT(*) as count FROM admin_users WHERE role = 'superadmin'`;
    const superadminResult = await executeQuery({ query: superadminQuery });
    const superadmin = superadminResult[0].count;

    const adminQuery = `SELECT COUNT(*) as count FROM admin_users WHERE role = 'admin'`;
    const adminResult = await executeQuery({ query: adminQuery });
    const admin = adminResult[0].count;

    const agentQuery = `SELECT COUNT(*) as count FROM admin_users WHERE role = 'agent'`;
    const agentResult = await executeQuery({ query: agentQuery });
    const agent = agentResult[0].count;

    const tlQuery = `SELECT COUNT(*) as count FROM admin_users WHERE role = 'teamleader'`;
    const tlResult = await executeQuery({ query: tlQuery });
    const teamleader = tlResult[0].count;

    // Get newly created accounts (last 30 days)
    const recentQuery = `
      SELECT COUNT(*) as count 
      FROM admin_users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `;
    const recentResult = await executeQuery({ query: recentQuery });
    const recentAccounts = recentResult[0].count;

    return NextResponse.json({
      total,
      superadmin,
      admin,
      agent,
      teamleader,
      recentAccounts
    });
  } catch (error) {
    console.error('Error fetching account statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account statistics' },
      { status: 500 }
    );
  }
}