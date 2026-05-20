import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Compass,
  Flame,
  Hourglass,
  Lightbulb,
  MapPin,
  Map,
  Scroll,
  Search,
  Share2,
  Sparkles,
  Star,
  Sword,
  Swords,
  Trophy,
  X,
  Check,
  Send,
  Crown,
  Layers,
  Globe,
  Quote,
  LucideIcon,
} from 'lucide-react-native';
import { palette } from '../themeEmber/palette';

export type GlyphName =
  | 'pin'
  | 'bookmark'
  | 'bookmarkFilled'
  | 'book'
  | 'map'
  | 'compass'
  | 'flame'
  | 'hourglass'
  | 'bulb'
  | 'scroll'
  | 'sparkle'
  | 'star'
  | 'sword'
  | 'swords'
  | 'trophy'
  | 'share'
  | 'chevronLeft'
  | 'chevronRight'
  | 'chevronUp'
  | 'chevronDown'
  | 'arrowLeft'
  | 'arrowRight'
  | 'close'
  | 'check'
  | 'send'
  | 'search'
  | 'crown'
  | 'layers'
  | 'globe'
  | 'quote';

const map: Record<GlyphName, LucideIcon> = {
  pin: MapPin,
  bookmark: Bookmark,
  bookmarkFilled: BookmarkCheck,
  book: BookOpen,
  map: Map,
  compass: Compass,
  flame: Flame,
  hourglass: Hourglass,
  bulb: Lightbulb,
  scroll: Scroll,
  sparkle: Sparkles,
  star: Star,
  sword: Sword,
  swords: Swords,
  trophy: Trophy,
  share: Share2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  close: X,
  check: Check,
  send: Send,
  search: Search,
  crown: Crown,
  layers: Layers,
  globe: Globe,
  quote: Quote,
};

type Props = {
  name: GlyphName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
};

export const Glyph: React.FC<Props> = ({
  name,
  size = 18,
  color = palette.bone,
  strokeWidth = 2,
  fill = 'none',
}) => {
  const Icon = map[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} fill={fill} />;
};

export default Glyph;
