require('dotenv').config();

const timestamp = Date.now();

module.exports = {
  TEST_ACCOUNTS: {
    admin: {
      id: process.env.ADMIN_ID,
      password: process.env.ADMIN_PW,
    },
  },
  WORKER_DATA: {
    create: {
      id: 'qa_' + timestamp,
      password: 'Test1234!',
      name: 'QA테스트',
    },
    search: {
      keyword: 'yukorea',
      notExist: 'zzz_not_exist_xyz',
    },
  },
};