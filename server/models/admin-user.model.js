const mongoose = require('mongoose');
const sha1 = require('../services/sha1.service');
const unique = require('mongoose-unique-validator');

/**
 * 管理员
 */
const AdminUserSchema = new mongoose.Schema({

  // 邮箱
  email: {
    type: String, unique: true, trim: true, lowercase: true, required: true,
    match: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  },

  // 密码
  password: { type: String, set: sha1, required: true },

  // 手机
  mobile: { type: Number },

  // 昵称
  nickname: { type: String, trim: true, minlength: 2, maxlength: 20 },
  
  // 头像
  avatar: { type: String, trim: true },

  // 注册信息
  create: {
    // 时间
    date: { type: Date, default: Date.now() },
    // 地点
    address: { type: String, trim: true },
    // IP
    ip: { type: String, trim: true, match: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/ },
    // 平台
    platform: { type: String, trim: true },
    // 其他
    collection: { type: Object }
  },

  // 用户组
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminGroup' },
  
}, {
  collection: 'adminUser',
  id: false
});

AdminUserSchema.plugin(unique);

module.exports = mongoose.model('AdminUser', AdminUserSchema);
