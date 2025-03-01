import localFont from 'next/font/local'

export const yourFont = localFont({
  src: [
    {
      path: '../public/fonts/Faseyha_bld_hinted_v2.ttf',
      weight: '700',
      style: 'bold',
    },
    {
      path: '../public/fonts/Faseyha_reg_hinted_v2.ttf',
      weight: '300',
      style: 'normal',
    },
  ],
  variable: '--font-custom' // This creates a CSS variable
})


export const arabicFont = localFont({
  src: [
    {
      path: '../public/fonts/arabic.ttf',
    }
  ],
  variable: '--font-arabicAmj'
})