export interface MenuOption {
  icon: string;
  label: string;
  router: string;
  subLabel?: string;
  badge?: string;
}

export const MENU_OPTIONS: MenuOption[] = [
  {
    icon: 'fa-solid fa-users',
    label: 'Usuario',
    router: '/dashboard/users',
    subLabel: 'Perfil de la cuenta',
  },
  {
    icon: 'fa-solid fa-wallet',
    label: 'Billetera',
    router: '/dashboard/wallet',
    subLabel: 'Transacciones y saldo',
  },
];
