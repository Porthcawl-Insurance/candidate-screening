const { expect } = require('chai');
const { Admin } = require('../../models');

describe('Admin presave', () => {
  it('saves without modifying password', async () => {
    let admin = await Admin.create({ email: 'admin_model@test.com', password: 'password' });
    admin.email = 'admin_model2@test.com';
    admin = await admin.save();
    expect(admin.email).to.equal('admin_model2@test.com');
  });
});
