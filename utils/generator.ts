export function generateRequestId() {
  // 1. 获取13位时间戳（毫秒）
  const timestamp = Date.now().toString();

  // 2. 生成3位随机数（避免毫秒内冲突）
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');

  // 3. 计算校验码（取时间戳后4位 + 盐值运算）
  const last4 = parseInt(timestamp.slice(-4)) || 0; // 防止空值
  const salt = 0x2a3b; // 固定盐值（需与后端一致）
  const checksum = ((last4 ^ salt) & 0xffff).toString(16).padStart(4, '0').toLowerCase();

  // 4. 组合ID: [时间戳13位] + [随机数3位] + [校验码4位]
  return timestamp + random + checksum;
}
