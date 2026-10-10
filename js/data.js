// ===== DATA: các loài nhện & tên bot =====
// Thêm nhện mới: push một object vào SP, rồi thêm giá x vào mảng PR trong online.js
const SP=[
{n:'Quả Phụ Đen',c1:'#2a2a36',c2:'#050508',ac:'#ff2a3a',eye:'#ff5566',hp:1,dm:1.05,sp:1,e:'Đạn Độc',r:'Mây Độc',ed:'Bắn 3 phi tiêu độc',rd:'Mây độc đốt máu địch trong vùng',er:520,rr:170},
{n:'Tarantula Nhung',c1:'#8a6038',c2:'#2a1a0e',ac:'#ffb060',eye:'#ffd080',hp:1.45,dm:.9,sp:.85,e:'Dậm Đất',r:'Mưa Lông',ed:'Sóng xung kích làm choáng',rd:'Bắn 18 lông gai mọi hướng',er:200,rr:380},
{n:'Nhện Nhảy Ngọc',c1:'#2fd6b0',c2:'#0b3b4a',ac:'#8affee',eye:'#ffffff',hp:.85,dm:1.1,sp:1.25,e:'Lưỡi Cưa Xoáy',r:'Vồ Mồi',ed:'Xoay tròn chém mọi kẻ gần',rd:'Phóng vồ + nổ khi chạm đất',er:140,rr:420},
{n:'Nhện Ma Tím',c1:'#a066ff',c2:'#1d0b3d',ac:'#e8c0ff',eye:'#f6e0ff',hp:1,dm:1,sp:1.05,e:'Bẫy Tơ',r:'Hút Hồn',ed:'Ném lưới tơ làm chậm diện rộng',rd:'Hút máu kẻ địch gần nhất',er:450,rr:400}];
SP[0].es=0;SP[0].rs=1;SP[1].es=1;SP[1].rs=0;SP[2].es=1;SP[2].rs=0;SP[2].rm=200;SP[3].es=0;SP[3].rs=1;SP[3].au='170,100,255';
SP.push({n:'Nhện Băng Giá',c1:'#a8ecff',c2:'#0a2a4a',ac:'#f0fcff',eye:'#00d0ff',hp:1.1,dm:.95,sp:1,e:'Mảnh Băng',r:'Bão Tuyết',ed:'Bắn 5 mảnh băng làm chậm',rd:'Sóng lạnh đóng băng kẻ xung quanh',er:450,rr:260,es:0,rs:1,au:'140,225,255'},
{n:'Nhện Dung Nham',c1:'#ff7a2a',c2:'#2a0a05',ac:'#ffd23a',eye:'#fff3a0',hp:1,dm:1.2,sp:1,e:'Cầu Lửa',r:'Địa Ngục Lửa',ed:'Cầu lửa nổ diện rộng',rd:'Vùng lửa thiêu đốt kéo dài',er:520,rr:190,es:0,rs:1,au:'255,120,40'},
{n:'Nhện Lưng Vàng',c1:'#ffd34a',c2:'#3a2a05',ac:'#fff0a0',eye:'#ff3030',hp:1.2,dm:.95,sp:.95,e:'Tơ Kéo',r:'Lưới Tử Thần',ed:'Phóng tơ kéo địch về phía bạn',rd:'Lưới khổng lồ làm chậm & gây đau',er:500,rr:250,es:0,rs:1});
const NAMES=['Tơ Đen','Nanh Độc','Bóng Đêm','Sát Thủ','Hắc Ám','Venom','Arachne','Charlotte','Shelob','Quỷ Chân Dài','Độc Nhãn','Ma Tơ','Vua Nhện','Lưỡi Hái','Tám Chân','Dạ Xoa','Huyết Nhện','Cuồng Phong','Thần Tơ','Mạng Đen','Phantom','Reaper'];
