const { TalentBench, Notification } = require('./models');

async function check() {
  try {
    const benchCount = await TalentBench.count();
    console.log('Total talent bench entries:', benchCount);
    const notifCount = await Notification.count();
    console.log('Total notifications:', notifCount);
    
    if (benchCount > 0) {
      const lastBench = await TalentBench.findOne({ order: [['id', 'DESC']] });
      console.log('Last bench entry:', JSON.stringify(lastBench, null, 2));
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
