const { Notification } = require('./models');

async function check() {
  try {
    const counts = await Notification.count();
    console.log('Total notifications:', counts);
    const last = await Notification.findOne({ order: [['createdAt', 'DESC']] });
    console.log('Last notification:', last ? JSON.stringify(last, null, 2) : 'None');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
