// Comprehensive Damage & Defect Dataset for Vehicles & Household Appliances
// PRD Sections 5, 6.6, 6.7 & 14
// Bộ dữ liệu chuẩn hóa đa lĩnh vực: Xe Cơ Giới (Ô tô, Xe máy) & Thiết Bị Trong Nhà (Điều hòa, Tủ lạnh, Quạt hơi nước, Điện tử, Đường ống)

export interface VehicleDefectClass {
  id: string;
  code: string;
  name: string;
  domain: 'vehicle' | 'appliance';
  vehicleType?: 'car' | 'motorcycle' | 'both';
  applianceType?: 'air_conditioner' | 'refrigerator' | 'mist_fan' | 'washing_machine' | 'induction_stove' | 'water_pipe';
  category: 'o_to' | 'xe_may' | 'cuu_ho' | 'dien_lanh' | 'do_gia_dung' | 'nuoc' | 'dien';
  severity: 'nguy_cap' | 'canh_bao' | 'trung_binh';
  visualSign: string;
  description: string;
  safetyWarning: string;
  suggestedAction: string;
  defaultBox: { x: number; y: number; width: number; height: number };
  estimatedCost: {
    labor: number;
    parts: number;
    partsName: string;
    travel: number;
  };
  featureSignature: {
    edgeDensity: 'high' | 'medium' | 'low';
    dominantColors: string[];
    damageLocation: 'front' | 'wheel' | 'body' | 'engine' | 'glass' | 'appliance_louver' | 'appliance_board' | 'appliance_water' | 'appliance_door';
    keywords: string[];
  };
}

export const VEHICLE_DEFECTS_DATASET: VehicleDefectClass[] = [
  // ==========================================
  // THIẾT BỊ TRONG NHÀ: ĐIỀU HÒA, TỦ LẠNH, QUẠT HƠI NƯỚC (PRD Mục 5.5, 5.6)
  // ==========================================

  // 1. ĐIỀU HÒA - CHẢY NƯỚC DÀN LẠNH / TẮC MÁNG NƯỚC THẢI
  {
    id: 'app-ac-water-leak-01',
    code: 'AC_WATER_LEAK_CLOGGED_DRAIN',
    name: 'Điều hòa chảy nước nhỏ giọt dàn lạnh & tắc ống thoát nước ngưng',
    domain: 'appliance',
    applianceType: 'air_conditioner',
    category: 'dien_lanh',
    severity: 'canh_bao',
    visualSign: 'Nước rỉ thành dòng nhỏ giọt từ mép dưới mặt nạ dàn lạnh, ố mốc trần thạch cao, rêu bẩn tắc máng xả',
    description: 'Bụi bẩn bám cặn lâu ngày tạo màng nhầy bịt kín lỗ thoát nước máng dàn lạnh, hoặc ống xả mềm bị gập đứt dốc khiến nước ngưng tràn qua khay hứng chảy ngược vào phòng.',
    safetyWarning: 'CẢNH BÁO: Nước chảy có thể ngấm vào bo mạch nguồn dàn lạnh gây chập cháy IC hoặc rơi vào ổ cắm điện âm tường bên dưới.',
    suggestedAction: 'Tháo mặt nạ vệ sinh bảo dưỡng dàn lạnh bằng máy phun áp lực chuyên dụng, thông máng xả và thay mới ống thoát ruột gà D16.',
    defaultBox: { x: 22, y: 35, width: 56, height: 42 },
    estimatedCost: {
      labor: 150000,
      parts: 40000,
      partsName: 'Ống thoát nước mềm chịu nhiệt D16 + dung dịch tẩy diệt khuẩn máng',
      travel: 20000
    },
    featureSignature: {
      edgeDensity: 'low',
      dominantColors: ['white_plastic', 'water_drop', 'louver'],
      damageLocation: 'appliance_louver',
      keywords: ['điều hòa', 'máy lạnh', 'chảy nước', 'nhỏ giọt', 'dàn lạnh', 'tắc ống', 'ac', 'rò nước']
    }
  },

  // 2. ĐIỀU HÒA - MẤT LẠNH / RÒ RỈ GAS / ĐÓNG TUYẾT DÀN ỐNG ĐỒNG
  {
    id: 'app-ac-gas-leak-ice-02',
    code: 'AC_GAS_LEAK_ICE_ACCUMULATION',
    name: 'Điều hòa mất lạnh, đóng tuyết trắng đầu ống đồng & rò rỉ gas R32/R410A',
    domain: 'appliance',
    applianceType: 'air_conditioner',
    category: 'dien_lanh',
    severity: 'nguy_cap',
    visualSign: 'Lớp băng tuyết trắng xóa bám dày ở rắc-co đầu đẩy dàn nóng hoặc bám tuyết trên cánh tản nhiệt dàn lạnh',
    description: 'Hệ thống bị hở mối hàn hoặc hở đầu nối loe đồng khiến gas lạnh bị thất thoát ra ngoài. Áp suất bay hơi giảm sâu dẫn đến hiện tượng đóng băng tuyết và máy chạy liên tục nhưng không phả hơi mát.',
    safetyWarning: 'NGUY CƠ CHÁY BLOCK (MÁY NÉN): Máy nén hoạt động thiếu môi chất bôi trơn sẽ bị quá nhiệt dẫn đến kẹt cơ khí, chi phí thay block rất tốn kém.',
    suggestedAction: 'Hút chân không thử kín nitơ, xử lý hàn xì đầu loe đồng, nạp gas R32/R410A chính hãng Ấn Độ theo đúng định mức PSI và dòng Ampe của máy.',
    defaultBox: { x: 25, y: 20, width: 52, height: 50 },
    estimatedCost: {
      labor: 180000,
      parts: 280000,
      partsName: 'Nạp bổ sung môi chất lạnh gas R32 chuẩn định mức + tán loe đồng D6/D10',
      travel: 20000
    },
    featureSignature: {
      edgeDensity: 'medium',
      dominantColors: ['white_frost', 'copper', 'metallic'],
      damageLocation: 'appliance_water',
      keywords: ['đóng tuyết', 'mất lạnh', 'hết gas', 'không mát', 'rò gas', 'ống đồng', 'tuyết']
    }
  },

  // 3. ĐIỀU HÒA - NỔ PHÙ TỤ BO MẠCH DÀN NÓNG / QUẠT KHÔNG QUAY
  {
    id: 'app-ac-pcb-capacitor-03',
    code: 'AC_PCB_CAPACITOR_BLOWN',
    name: 'Tụ đề bo mạch dàn nóng điều hòa bị phù rách đỉnh & chập nguồn',
    domain: 'appliance',
    applianceType: 'air_conditioner',
    category: 'dien_lanh',
    severity: 'nguy_cap',
    visualSign: 'Thân tụ nhôm 450V bị phồng đầu rách chữ thập, xì dịch dầu cách điện cháy xém chân cắm',
    description: 'Tụ ngậm khởi động block và quạt tản nhiệt dàn nóng bị suy hao điện dung hoặc điện áp lưới chập chờn gây phóng điện nổ phù đỉnh tụ. Máy lạnh chỉ chạy quạt gió trong nhà, ngoài trời im bặt.',
    safetyWarning: 'CẢNH BÁO ĐIỆN CAO ÁP: Tụ tích điện lớn, không chạm tay vào các cọc cực để tránh nguy cơ điện giật nguy hiểm.',
    suggestedAction: 'Xả điện tích an toàn, thay tụ kích khởi động Shizuki / Epcos 450V đúng thông số uF, kiểm tra role bảo vệ quá tải máy nén.',
    defaultBox: { x: 30, y: 25, width: 42, height: 44 },
    estimatedCost: {
      labor: 120000,
      parts: 95000,
      partsName: 'Tụ kích khởi động cao cấp 450V 35uF/45uF chịu nhiệt 85°C',
      travel: 20000
    },
    featureSignature: {
      edgeDensity: 'high',
      dominantColors: ['metallic_cylinder', 'burnt_black', 'pcb_green'],
      damageLocation: 'appliance_board',
      keywords: ['tụ điện', 'phù tụ', 'bo mạch', 'dàn nóng', 'quạt không quay', 'block không chạy', 'nổ tụ']
    }
  },

  // 4. TỦ LẠNH - KHÔNG LÀM ĐÁ / ĐÓNG TUYẾT DÀN XẢ / HỎNG CẢM BIẾN
  {
    id: 'app-fridge-not-cooling-04',
    code: 'FRIDGE_DEFROST_FAILURE_NOT_COOLING',
    name: 'Tủ lạnh không đông đá, hỏng cảm biến xả đá & nghẹt luồng gió ngăn mát',
    domain: 'appliance',
    applianceType: 'refrigerator',
    category: 'dien_lanh',
    severity: 'canh_bao',
    visualSign: 'Băng tuyết đóng cứng thành khối bịt kín quạt đối lưu dàn lạnh, ngăn đá mềm nhũn, ngăn mát ấm nóng',
    description: 'Hệ thống xả đá tự động bị tê liệt (hỏng sò lạnh âm, đứt cầu chì nhiệt hoặc cháy điện trở sấy kính). Băng tuyết đóng dầy ngăn cản quạt thổi khí lạnh xuống ngăn mát làm hỏng thực phẩm.',
    safetyWarning: 'Thực phẩm tươi sống có nguy cơ ôi thiu nhiễm khuẩn; quạt gió bị kẹt trong băng tuyết lâu có thể cháy cuộn motor.',
    suggestedAction: 'Rã đông cưỡng bức, kiểm tra điện trở sấy xả đá, thay thế sò lạnh cảm biến nhiệt Defrost sensor chính hãng.',
    defaultBox: { x: 26, y: 22, width: 48, height: 50 },
    estimatedCost: {
      labor: 160000,
      parts: 140000,
      partsName: 'Bộ cảm biến sò lạnh Defrost Sensor + cầu chì nhiệt bảo vệ 73°C',
      travel: 20000
    },
    featureSignature: {
      edgeDensity: 'medium',
      dominantColors: ['white_ice', 'plastic_shelf', 'fridge_inner'],
      damageLocation: 'appliance_water',
      keywords: ['tủ lạnh', 'không đông đá', 'không lạnh', 'ngăn mát ấm', 'đóng tuyết', 'fridge', 'refrigerator']
    }
  },

  // 5. TỦ LẠNH - RÁCH HỞ GIOĂNG CAO SU VIỀN CỬA / ĐỌNG NƯỚC
  {
    id: 'app-fridge-gasket-05',
    code: 'FRIDGE_DOOR_GASKET_TORN_WARPED',
    name: 'Hở rách gioăng cao su viền cánh cửa tủ lạnh & thoát nhiệt đọng sương',
    domain: 'appliance',
    applianceType: 'refrigerator',
    category: 'dien_lanh',
    severity: 'trung_binh',
    visualSign: 'Gioăng cao su mép cửa bị chai cứng, hở khe hở lọt sáng, đọng hạt sương ẩm mốc xung quanh mép',
    description: 'Dải nam châm trong gioăng cao su cánh cửa bị mất từ tính hoặc cao su bị lão hóa chai cứng rách góc, không hít chặt vào thân tủ khiến không khí nóng ẩm bên ngoài tràn vào làm máy nén chạy quá tải tốn điện.',
    safetyWarning: 'Tủ lạnh chạy liên tục 24/24 gây tốn gấp đôi tiền điện và giảm tuổi thọ của lốc máy.',
    suggestedAction: 'Phục hồi cân chỉnh nhiệt đàn hồi hoặc thay ron gioăng cao su viền cửa từ tính zin theo đúng kích thước model tủ.',
    defaultBox: { x: 18, y: 20, width: 62, height: 58 },
    estimatedCost: {
      labor: 110000,
      parts: 180000,
      partsName: 'Bộ gioăng cao su cánh cửa tủ lạnh từ tính đa năng cao cấp',
      travel: 20000
    },
    featureSignature: {
      edgeDensity: 'low',
      dominantColors: ['rubber_white', 'metal_body', 'water_bead'],
      damageLocation: 'appliance_door',
      keywords: ['gioăng', 'ron cửa', 'hở cửa', 'đọng sương', 'cánh cửa tủ lạnh', 'gasket']
    }
  },

  // 6. QUẠT HƠI NƯỚC / QUẠT ĐIỀU HÒA - HỎNG BƠM NƯỚC / KHÔNG LÊN NƯỚC
  {
    id: 'app-mist-fan-pump-06',
    code: 'MIST_FAN_WATER_PUMP_FAILURE',
    name: 'Quạt hơi nước (Quạt điều hòa) hỏng bơm chìm, không bơm nước lên giàn',
    domain: 'appliance',
    applianceType: 'mist_fan',
    category: 'do_gia_dung',
    severity: 'canh_bao',
    visualSign: 'Tấm làm mát Cooling Pad khô cong, bật chế độ Cool chỉ nghe tiếng tít nhưng không có nước chảy xuống khay',
    description: 'Máy bơm chìm mini 220V trong thùng chứa bị kẹt cánh quạt do cặn canxi hoặc cháy cuộn từ do cạn nước lâu ngày mà không tự ngắt. Quạt chỉ thổi ra gió nóng như quạt thường.',
    safetyWarning: 'Tránh để quạt cạn nước lâu khi đang bật chế độ Cool để ngăn nguy cơ chập cuộn dây bơm chìm.',
    suggestedAction: 'Vệ sinh cặn canxi bồn chứa nước, thông ống chia giàn phun và thay thế máy bơm chìm cảm biến chống cạn nước chuyên dụng.',
    defaultBox: { x: 25, y: 30, width: 50, height: 48 },
    estimatedCost: {
      labor: 90000,
      parts: 130000,
      partsName: 'Bơm chìm quạt điều hòa 18W-25W siêu êm có rơ-le chống cạn nước',
      travel: 20000
    },
    featureSignature: {
      edgeDensity: 'medium',
      dominantColors: ['blue_water', 'honeycomb_pad', 'black_plastic'],
      damageLocation: 'appliance_water',
      keywords: ['quạt hơi nước', 'quạt điều hòa', 'không bơm nước', 'hỏng bơm', 'cooling pad', 'máy làm mát']
    }
  },

  // 7. QUẠT HƠI NƯỚC - KẸT TRỤC BẠC / CHÁY MOTOR QUAY YẾU HOẶC KHÔNG QUAY
  {
    id: 'app-mist-fan-motor-07',
    code: 'MIST_FAN_BLOWER_MOTOR_JAMMED',
    name: 'Quạt hơi nước kẹt trục bạc, bó cứng cánh lồng sóc & cháy motor',
    domain: 'appliance',
    applianceType: 'mist_fan',
    category: 'do_gia_dung',
    severity: 'nguy_cap',
    visualSign: 'Cánh quạt lồng sóc quay lờ đờ hoặc đứng im, thân motor nóng rát, có mùi khét nhẹ và tiếng kêu ù ù',
    description: 'Bạc thau và trục cốt motor bị khô dầu mỡ do môi trường hơi nước ẩm cao, ma sát làm xước cốt gây bó cứng roto. Tụ đề quạt bị nổ hoặc đứt cầu chì nhiệt bảo vệ trong cuộn đồng.',
    safetyWarning: 'NGUY CƠ CHÁY MOTOR: Đang bị bó cốt mà vẫn cắm điện sẽ làm nóng chảy cuộn dây đồng sinh nhiệt bốc khói hỏa hoạn.',
    suggestedAction: 'Rút phích cắm ngay, đánh bóng tra dầu mỡ chịu nhiệt trục bạc hoặc thay thế motor quạt lồng sóc lõi đồng 100%.',
    defaultBox: { x: 22, y: 24, width: 55, height: 52 },
    estimatedCost: {
      labor: 110000,
      parts: 220000,
      partsName: 'Cụm motor quạt điều hòa dây đồng 100W-150W + tụ kích khởi động',
      travel: 20000
    },
    featureSignature: {
      edgeDensity: 'high',
      dominantColors: ['fan_grille', 'copper_wire', 'black_casing'],
      damageLocation: 'appliance_board',
      keywords: ['kẹt quạt', 'quay yếu', 'không quay', 'kêu ù', 'mùi khét', 'motor quạt', 'quạt nước']
    }
  },

  // 8. ĐƯỜNG ỐNG NƯỚC - RÒ RỈ NỨT KHỚP NỐI PVC (PRD 5.4)
  {
    id: 'app-pipe-leak-08',
    code: 'PLUMBING_PIPE_LEAK_BURST',
    name: 'Rò rỉ nứt khớp nối ống nước PVC chịu áp lực cao',
    domain: 'appliance',
    applianceType: 'water_pipe',
    category: 'nuoc',
    severity: 'nguy_cap',
    visualSign: 'Nước phun tia hoặc rỉ thành dòng tại khớp nối T chữ co lơ ống nước dưới chậu rửa / hộp kỹ thuật',
    description: 'Vết nứt chân chim tại co nối ren nhựa hoặc lớp keo dán PVC bị lão hóa thoái hóa chịu áp suất thủy lực lớn, nước thẩm thấu làm ẩm mục tường và thất thoát lưu lượng nước sạch sinh hoạt.',
    safetyWarning: 'Khóa van nước tổng ngay lập tức để tránh ngấm sập trần thạch cao và chạm chập điện âm tường.',
    suggestedAction: 'Cắt bỏ đoạn co nứt vỡ, thay thế co nối PVC Tiền Phong D27 dày chịu áp lực kết hợp keo dán chuyên dụng.',
    defaultBox: { x: 28, y: 32, width: 44, height: 38 },
    estimatedCost: {
      labor: 110000,
      parts: 45000,
      partsName: 'Co nối chữ T PVC D27 chịu áp lực + Keo dán chuyên dụng Tiền Phong',
      travel: 20000
    },
    featureSignature: {
      edgeDensity: 'medium',
      dominantColors: ['water_spray', 'pvc_gray', 'chrome_faucet'],
      damageLocation: 'appliance_water',
      keywords: ['ống nước', 'rò rỉ', 'nứt ống', 'chảy nước', 'bục ống', 'plumbing', 'van nước']
    }
  },

  // ==========================================
  // XE CƠ GIỚI: Ô TÔ & XE MÁY (PRD Mục 5.1, 5.2)
  // ==========================================

  // 9. Ô TÔ - VA CHẠM ĐẦU XE / VỠ CẢN TRƯỚC (BUMPER CRASH)
  {
    id: 'veh-car-front-crash-01',
    code: 'AUTO_FRONT_BUMPER_CRASH',
    name: 'Vỡ cản trước (Ba-đờ-sốc) & biến dạng đầu xe sau va chạm',
    domain: 'vehicle',
    vehicleType: 'car',
    category: 'o_to',
    severity: 'nguy_cap',
    visualSign: 'Cản trước vỡ nứt gãy lớn, mặt ca-lăng xô lệch, biển số rơi hoặc cong vẹo, hở ngàm đỡ đầu xe',
    description: 'Phát hiện tổn hại va chạm trực diện: Cản trước (bumper) bị gãy nứt kết cấu nhựa composite, bung chốt ngàm, xô lệch mặt ca-lăng tản nhiệt và rơi biển số. Cần kiểm tra cụm giàn nóng điều hòa, két nước làm mát và tai đèn pha bên trong.',
    safetyWarning: 'NGUY CƠ MẤT AN TOÀN CAO: Các mảng nhựa vỡ có nguy cơ cọ quẹt nổ lốp xe khi đánh lái; két nước có thể rò rỉ dẫn tới bó cứng động cơ trên đường.',
    suggestedAction: 'Tháo dỡ cản trước nứt vỡ, kiểm tra hệ thống làm mát động cơ, nắn chỉnh xương giằng đỡ và thay thế cụm cản trước chính hãng sơn theo mã màu xe.',
    defaultBox: { x: 18, y: 22, width: 64, height: 56 },
    estimatedCost: {
      labor: 280000,
      parts: 950000,
      partsName: 'Cụm cản trước (Ba-đờ-sốc) chính hãng + bộ ngàm định vị',
      travel: 30000
    },
    featureSignature: {
      edgeDensity: 'high',
      dominantColors: ['dark', 'metallic', 'plastic_black'],
      damageLocation: 'front',
      keywords: ['bumper', 'cản', 'ba đờ sốc', 'va chạm', 'crash', 'km', 'vỡ', 'đầu xe', 'tai nạn', 'oto', 'car']
    }
  },

  // 10. Ô TÔ - MÓP MÉO THÂN VỎ / CỬA XE (BODY DENT & SCRATCH)
  {
    id: 'veh-car-dent-scratch-02',
    code: 'AUTO_BODY_DENT_SCRATCH',
    name: 'Móp méo thân vỏ xe & trầy xước sâu lộ lớp sơn lót kim loại',
    domain: 'vehicle',
    vehicleType: 'car',
    category: 'o_to',
    severity: 'canh_bao',
    visualSign: 'Mảng lõm biến dạng trên cửa/tai xe, vệt xước xé rách lớp bóng bóng và lộ sơn tĩnh điện',
    description: 'Bề mặt tấm tôn thân xe bị lực tì nén gây biến dạng lõm sâu, diện tích xước dài trên 15cm làm lộ kim loại tôn thép, có nguy cơ bị oxy hóa gỉ sét nhanh khi gặp mưa axit.',
    safetyWarning: 'Cần xử lý chống gỉ bề mặt sớm trước khi kim loại tôn bị mục rỉ lan rộng sang mép gioăng cửa.',
    suggestedAction: 'Hút phục hồi vết lõm bằng công nghệ PDR không sơn lại hoặc gò hàn giật tôn kết hợp sơn sấy hồng ngoại 3 lớp.',
    defaultBox: { x: 22, y: 20, width: 55, height: 50 },
    estimatedCost: {
      labor: 220000,
      parts: 350000,
      partsName: 'Vật tư giật tôn PDR + bột bả & sơn sấy Dupont chính hãng',
      travel: 30000
    },
    featureSignature: {
      edgeDensity: 'medium',
      dominantColors: ['metallic', 'paint'],
      damageLocation: 'body',
      keywords: ['móp', 'dent', 'xước', 'scratch', 'cửa', 'thân vỏ', 'tai xe', 'gò']
    }
  },

  // 11. Ô TÔ - NỨT VỠ KÍNH CHẮN GIÓ (WINDSHIELD)
  {
    id: 'veh-car-windshield-03',
    code: 'AUTO_WINDSHIELD_CRACK',
    name: 'Kính chắn gió ô tô nứt rạn chân chim hình mạng nhện',
    domain: 'vehicle',
    vehicleType: 'car',
    category: 'o_to',
    severity: 'nguy_cap',
    visualSign: 'Tâm điểm va đập đá văng tạo các tia nứt rạn lan rộng trên bề mặt kính an toàn 2 lớp',
    description: 'Kính chắn gió trước bị nứt vỡ từ điểm va đập đá dăm, các vết rạn đang phát triển theo đường kính ngang tầm nhìn lái xe. Lớp màng PVB chống vỡ đang chịu tải nhiệt độ cao.',
    safetyWarning: 'CẢNH BÁO AN TOÀN: Khi xe đi qua gờ giảm tốc hoặc gặp luồng gió mạnh, kính có nguy cơ nứt toác hoàn toàn gây cản trở tầm quan sát.',
    suggestedAction: 'Hàn phục hồi keo quang học UV chuyên dụng nếu vết nứt dưới 10cm hoặc thay mới kính chắn gió an toàn 2 lớp chính hãng.',
    defaultBox: { x: 25, y: 18, width: 50, height: 48 },
    estimatedCost: {
      labor: 200000,
      parts: 850000,
      partsName: 'Kính chắn gió an toàn cách nhiệt chính hãng theo xe',
      travel: 30000
    },
    featureSignature: {
      edgeDensity: 'high',
      dominantColors: ['glass', 'transparent', 'bright'],
      damageLocation: 'glass',
      keywords: ['kính', 'windshield', 'glass', 'nứt', 'đá văng', 'rạn']
    }
  },

  // 12. XE MÁY - LỐP XE MÒN LỆCH & NỨT CHÂN CHIM (MOTORBIKE TIRE)
  {
    id: 'veh-moto-tire-06',
    code: 'MOTO_TIRE_PUNCTURE_WEAR',
    name: 'Lốp xe máy mòn lệch, rách mép & nứt chân chim trơ bố',
    domain: 'vehicle',
    vehicleType: 'motorcycle',
    category: 'xe_may',
    severity: 'nguy_cap',
    visualSign: 'Gai lốp mòn trơ vân cao su phẳng lỳ, vết rách hông lốp lộ sợi bố chịu lực nylon/thép',
    description: 'Lốp xe máy đã vượt quá giới hạn an toàn mòn (dưới 0.8mm), cao su bị lão hóa chai cứng nứt rạn chân chim. Áp suất khí bị thất thoát liên tục qua các vết rạn.',
    safetyWarning: 'CỰC KỲ NGUY HIỂM: Rất dễ bị trượt ngã khi vào cua trời mưa hoặc nổ lốp tức thì khi cán sỏi nhọn ở tốc độ 40km/h.',
    suggestedAction: 'Thay thế lốp không săm (Tubeless) Maxxis hoặc Michelin đúng kích thước thông số và cân chỉnh vành xe.',
    defaultBox: { x: 22, y: 20, width: 56, height: 55 },
    estimatedCost: {
      labor: 60000,
      parts: 380000,
      partsName: 'Lốp xe máy Maxxis Tubeless 90/90-14 chính hãng',
      travel: 20000
    },
    featureSignature: {
      edgeDensity: 'medium',
      dominantColors: ['dark', 'rubber_black'],
      damageLocation: 'wheel',
      keywords: ['lốp', 'bánh', 'tire', 'thủng', 'săm', 'mòn', 'nổ lốp', 'xe máy']
    }
  },

  // 13. XE MÁY & Ô TÔ - BÌNH ẮC QUY TỤT ÁP / SULFATE (BATTERY)
  {
    id: 'veh-both-battery-08',
    code: 'VEH_BATTERY_DEAD_SULFATE',
    name: 'Bình ắc quy sulfat hóa, tụt áp không đề nổ được máy',
    domain: 'vehicle',
    vehicleType: 'both',
    category: 'cuu_ho',
    severity: 'trung_binh',
    visualSign: 'Cọc âm/dương ắc quy bám muối sunfat màu trắng xanh, thân bình phồng nhẹ, đồng hồ sụt áp dưới 10.5V',
    description: 'Ắc quy đã hết chu kỳ nạp xả: Các bản cực chì bên trong bị chai cứng sulfat hóa, nội trở tăng vọt khiến dòng khởi động CCA sụt giảm, bấm nút đề chỉ nghe tiếng tạch tạch.',
    safetyWarning: 'Xe không thể tự nổ máy, không kích đề liên tục quá 5 giây để tránh cháy củ đề xe.',
    suggestedAction: 'Kích nổ cứu hộ bằng bộ sạc dự phòng chuyên dụng hoặc thay bình ắc quy khô bảo dưỡng mới bảo hành 9 tháng.',
    defaultBox: { x: 25, y: 22, width: 50, height: 48 },
    estimatedCost: {
      labor: 50000,
      parts: 290000,
      partsName: 'Ắc quy khô miễn bảo dưỡng GS GTZ5S 12V-3.5Ah chính hãng',
      travel: 20000
    },
    featureSignature: {
      edgeDensity: 'medium',
      dominantColors: ['dark', 'white_crystal', 'battery_body'],
      damageLocation: 'engine',
      keywords: ['ắc quy', 'bình', 'battery', 'hết điện', 'không đề được', 'kích bình', 'tụt áp']
    }
  }
];
