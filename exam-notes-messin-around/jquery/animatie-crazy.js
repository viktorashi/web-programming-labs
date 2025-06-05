// $(document).ready(() => {
//   console.log('sa moara batieti ica am terminat')
// })

// cica e echivalent cu

// $(() => {
//   console.log('sa moara batieti ica am terminat')
// })

// amandoua merg cand e fully laoded

// $('body').html('nuj sincer')
// $('body').remove()

// $(document).one('scroll', () => {
//   console.log('s-a dat scroll')
// })

// $(document).off('scroll')

$('button').click(() => {
  $('#div1').animate({
    left: '500px',
    opacity: '0.5',
    height: '100px',
    width: '60px'
  })
})
