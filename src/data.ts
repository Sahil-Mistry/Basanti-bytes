export type PropType = 'verified' | 'premium' | 'alert' | 'pending' | 'default';

export interface Property {
  id: number;
  lat: number;
  lng: number;
  type: PropType;
  price: string;
  psf: string;
  title: string;
  config: string;
  area: string;
  loc: string;
  floor: string;
  age: string;
}

export const PROPS: Property[] = [
  { id:1, lat:19.0596, lng:72.8295, type:'verified', price:'₹2.4 Cr',  psf:'₹16,552', title:'Skyline Residency',   config:'3 BHK', area:'1,450 sq ft', loc:'Bandra West',  floor:'8th of 22',  age:'2 yrs' },
  { id:2, lat:19.0728, lng:72.8369, type:'premium',  price:'₹1.85 Cr', psf:'₹16,818', title:'Oberoi Gardens',      config:'2 BHK', area:'1,100 sq ft', loc:'Khar West',    floor:'4th of 14',  age:'4 yrs' },
  { id:3, lat:19.0820, lng:72.8360, type:'alert',    price:'₹4.2 Cr',  psf:'₹20,000', title:'Prestige Tower',      config:'4 BHK', area:'2,100 sq ft', loc:'Santacruz W',  floor:'15th of 30', age:'1 yr'  },
  { id:4, lat:19.1075, lng:72.8263, type:'default',  price:'₹6.5 Cr',  psf:'₹20,313', title:'The Address',         config:'4 BHK', area:'3,200 sq ft', loc:'Juhu',          floor:'9th of 12',  age:'6 yrs' },
  { id:5, lat:19.1197, lng:72.8464, type:'pending',  price:'₹1.2 Cr',  psf:'₹12,632', title:'Rustomjee Elements',  config:'2 BHK', area:'950 sq ft',   loc:'Andheri W',    floor:'6th of 20',  age:'3 yrs' },
  { id:6, lat:19.0444, lng:72.8637, type:'verified', price:'₹3.1 Cr',  psf:'₹18,235', title:'Godrej Platinum',     config:'3 BHK', area:'1,700 sq ft', loc:'Vikhroli',      floor:'12th of 28', age:'New'   },
];

/* Coastal Drift pin colours per property type */
export const PIN_COLOR: Record<PropType, string> = {
  default:  '#1A6870',
  verified: '#1A6870',
  premium:  '#A07048',
  alert:    '#9A2A18',
  pending:  '#8B6914',
};

export interface StatusStyle { bg: string; c: string; lbl: string; }
export const STS: Record<PropType, StatusStyle> = {
  verified: { bg:'#D4EFF2', c:'#0E5860', lbl:'✓ Verified' },
  premium:  { bg:'#F4EAD8', c:'#7A5030', lbl:'★ Premium'  },
  alert:    { bg:'#FCEAE4', c:'#9A2A18', lbl:'⚠ Alert'    },
  pending:  { bg:'#FEF6E0', c:'#8B6914', lbl:'⏳ Pending'  },
  default:  { bg:'#D4EFF2', c:'#104E58', lbl:'Default'     },
};
