export interface Palette {
  primary_color: string;
  hero_gradient: string;
  share_gradient: string;
  share_border_color: string;
  share_icon_bg_color: string;
  share_icon_color: string;
  button_gradient: string;
  button_container_gradient: string;
  pro_tips_bg_color: string;
}

export const colorPalettes: { [key: string]: Palette } = {
  amber: {
    primary_color: '#fb923c',
    hero_gradient: 'linear-gradient(to right, #fef3c7, #fde68a, #fcd34d)',
    share_gradient: 'linear-gradient(to bottom right, #fde68a, #fff7ed, #fde68a)',
    share_border_color: '#fde68a',
    share_icon_bg_color: '#fcd34d',
    share_icon_color: '#78350f',
    button_gradient: 'linear-gradient(to right, #fb923c, #fbbf24)',
    button_container_gradient: 'bg-gradient-to-r from-orange-400 to-amber-500',
    pro_tips_bg_color: '#fff7ed',
  },
  green: {
    primary_color: '#22c55e',
    hero_gradient: 'linear-gradient(to right, #dcfce7, #bbf7d0, #86efac)',
    share_gradient: 'linear-gradient(to bottom right, #bbf7d0, #ecfdf5, #d1fae5)',
    share_border_color: '#bbf7d0',
    share_icon_bg_color: '#86efac',
    share_icon_color: '#14532d',
    button_gradient: 'linear-gradient(to right, #22c55e, #10b981)',
    button_container_gradient: 'linear-gradient(to right, #4ade80, #10b981)',
    pro_tips_bg_color: '#ecfdf5',
  },
  creme: {
    primary_color: 'rgb(163, 73, 0)',
    hero_gradient: 'linear-gradient(to right, #ffedd5, #fefce8)',
    share_gradient: 'linear-gradient(to bottom right, #ffedd5, #fefce8, #ffedd5)',
    share_border_color: '#fed7aa',
    share_icon_bg_color: 'rgba(254, 215, 170, 0.4)',
    share_icon_color: '#9a3412',
    button_gradient: 'linear-gradient(to right, #fb923c,rgb(163, 73, 0))',
    button_container_gradient: '#fff7ed',
    pro_tips_bg_color: '#ffffff',
  },
  blue: {
    primary_color: '#3b82f6',
    hero_gradient: 'linear-gradient(to right, #a5c9ff, #6a9eff, #4f8aff)',
    share_gradient: 'linear-gradient(to bottom right, #dbeafe, #eff6ff, #a5c9ff)',
    share_border_color: '#bfdbfe',
    share_icon_bg_color: '#93c5fd',
    share_icon_color: '#1e3a8a',
    button_gradient: 'linear-gradient(to right, #3b82f6, #2563eb)',
    button_container_gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
    pro_tips_bg_color: '#dbeafe',
  },
};
