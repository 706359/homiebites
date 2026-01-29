/**
 * Lucide React icon wrapper. Maps Font Awesome–style names to Lucide icons.
 * Usage: <Icon name="chart-line" className="..." size={20} />
 * Names can be "fa-xxx" or "xxx" (fa-solid/fa-regular/fa-brands stripped).
 */
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Banknote,
  BarChart2,
  Bell,
  BellOff,
  Building,
  Calendar,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  ClipboardList,
  Clock,
  CloudOff,
  Coins,
  Copy,
  CreditCard,
  Crown,
  Database,
  DoorOpen,
  Download,
  Droplet,
  Eye,
  EyeOff,
  File,
  FileText,
  Filter,
  FilterX,
  Flame,
  FolderOpen,
  Footprints,
  Globe,
  Hash,
  Heart,
  Home,
  Image,
  Images,
  Inbox,
  IndianRupee,
  Info,
  Key,
  LayoutGrid,
  Leaf,
  Lightbulb,
  LineChart,
  List,
  ListChecks,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Maximize2,
  Megaphone,
  Menu,
  MessageCircle,
  MessageSquare,
  Minimize2,
  Minus,
  Moon,
  Package,
  Palette,
  Pencil,
  Phone,
  PieChart,
  Plus,
  RotateCcw,
  RotateCw,
  Save,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Soup,
  Sparkles,
  Star,
  Store,
  Sun,
  Table,
  Tag,
  ToggleRight,
  Trash2,
  TrendingUp,
  TriangleAlert,
  Truck,
  Type,
  Upload,
  UploadCloud,
  User,
  Users,
  UtensilsCrossed,
  Wifi,
  X,
} from 'lucide-react';

const ICON_MAP = {
  'chart-line': TrendingUp,
  'rupee-sign': IndianRupee,
  'indian-rupee-sign': IndianRupee,
  'shopping-cart': ShoppingCart,
  'exclamation-triangle': TriangleAlert,
  'triangle-exclamation': TriangleAlert,
  users: Users,
  'chart-bar': BarChart2,
  'clock-rotate-left': RotateCcw,
  images: Images,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  check: Check,
  xmark: X,
  times: X,
  whatsapp: MessageCircle,
  'location-dot': MapPin,
  truck: Truck,
  walking: Footprints,
  gate: DoorOpen,
  plus: Plus,
  'info-circle': Info,
  minus: Minus,
  'check-circle': CheckCircle,
  'clipboard-list': ClipboardList,
  'calendar-day': CalendarDays,
  hashtag: Hash,
  calendar: Calendar,
  'calendar-alt': Calendar,
  'calendar-week': Calendar,
  clock: Clock,
  trash: Trash2,
  phone: Phone,
  'shield-halved': Shield,
  'shield-check': ShieldCheck,
  envelope: Mail,
  lock: Lock,
  spinner: Loader2,
  'arrow-right-to-bracket': LogIn,
  key: Key,
  cog: Settings,
  'sign-out-alt': LogOut,
  bell: Bell,
  database: Database,
  user: User,
  palette: Palette,
  building: Building,
  store: Store,
  bullhorn: Megaphone,
  save: Save,
  tag: Tag,
  sun: Sun,
  moon: Moon,
  box: Package,
  'toggle-on': ToggleRight,
  'calendar-check': CalendarCheck,
  'list-check': ListChecks,
  magic: Sparkles,
  copy: Copy,
  message: MessageSquare,
  'money-bill-wave': Banknote,
  font: Type,
  'text-height': Type,
  'eye-slash': EyeOff,
  'cloud-upload-alt': UploadCloud,
  'folder-open': FolderOpen,
  file: File,
  'window-minimize': Minimize2,
  'arrow-down': ArrowDown,
  'window-maximize': Maximize2,
  download: Download,
  upload: Upload,
  coins: Coins,
  pencil: Pencil,
  crown: Crown,
  star: Star,
  table: Table,
  th: LayoutGrid,
  list: List,
  inbox: Inbox,
  circle: Circle,
  'arrow-up': ArrowUp,
  'arrow-right': ArrowRight,
  utensils: UtensilsCrossed,
  'file-alt': FileText,
  'chart-pie': PieChart,
  'times-circle': X,
  'circle-check': CheckCircle,
  filter: Filter,
  'filter-circle-xmark': FilterX,
  'credit-card': CreditCard,
  'chart-area': LineChart,
  image: Image,
  wifi: Wifi,
  'cloud-exclamation': CloudOff,
  leaf: Leaf,
  house: Home,
  home: Home,
  droplet: Droplet,
  'truck-fast': Truck,
  fire: Flame,
  heart: Heart,
  globe: Globe,
  'circle-exclamation': TriangleAlert,
  'circle-info': Info,
  'exclamation-circle': TriangleAlert,
  'bowl-rice': Soup,
  'bread-slice': UtensilsCrossed,
  'person-walking': Footprints,
  'toggle-off': ToggleRight,
  bars: Menu,
  rotate: RotateCw,
  // Additional names used across the app
  pen: Pencil,
  tags: Tag,
  'map-marker-alt': MapPin,
  'sync-alt': RotateCw,
  eye: Eye,
  'bell-slash': BellOff,
  exclamation: TriangleAlert,
  search: Search,
  'magnifying-glass': Search,
  'paper-plane': Send,
  'arrow-left': ArrowLeft,
  lightbulb: Lightbulb,
  'calendar-days': CalendarDays,
  comments: MessageCircle,
  'rotate-right': RotateCw,
  refresh: RotateCw,
};

/** Official WhatsApp brand icon (green logo) */
function WhatsAppIcon({ size = 20, className = '', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden
      {...props}
    >
      <path
        fill="#FFF8E7"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  );
}

function getIconComponent(name) {
  if (!name || typeof name !== 'string') return null;
  const key = name
    .replace(/^fa-(solid|regular|brands)\s+/, '')
    .replace(/^fa-/, '')
    .trim();
  return ICON_MAP[key] || null;
}

export default function Icon({
  name,
  className = '',
  size = 20,
  spin = false,
  ...props
}) {
  const key = name
    ? String(name)
        .replace(/^fa-(solid|regular|brands)\s+/, '')
        .replace(/^fa-/, '')
        .trim()
    : '';
  if (key === 'whatsapp') {
    const whatsappSize = Math.max(14, Math.round(size * 0.85));
    return (
      <WhatsAppIcon
        size={whatsappSize}
        className={`lucide-icon ${className}`.trim()}
        {...props}
      />
    );
  }
  const Component = getIconComponent(name);
  if (!Component) return null;
  const isLoader = name === 'spinner' || String(name).includes('spinner');
  const spinClass = spin || isLoader ? 'lucide-icon-spin' : '';
  return (
    <Component
      size={size}
      className={`lucide-icon ${spinClass} ${className}`.trim()}
      aria-hidden
      {...props}
    />
  );
}

export { getIconComponent, ICON_MAP };
