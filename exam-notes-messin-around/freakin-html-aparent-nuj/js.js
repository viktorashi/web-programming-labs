// whatt merge asta cu css thats insane
// okkk creca am crezut ca n-are cum sa fie ca nu

// ok ok in asta ar fi
$('p').css('background-color', 'red')
// cica
$('p').css('background-color')
//     Description: Get the computed style properties for the first element in the set of matched elements.
// $('p').hide()
// $('p').css({ display: 'none' })
// $('p').css('display', 'none')

// in genreal visibilit schimba vizibilitatea fara sa schimbe nimic despre layout sau sa sa considere ca nu mai e acolo, gen inca ocupa spatiu in pagina
// $('p').css('visibility', 'hidden')

// ok deci aparent daca vrei style la fiecare, e .style sub seelctor normal, dar clasa e doar classList, nu sub style deloc
// document.querySelector('p').style.opacity = '0';
// document.querySelector('p').classList.add('hide');

// same as
// document.querySelectorAll('p').forEach(p => (p.style.backgroundColor = 'red'))

console.log($('p'))
console.log(typeof $('p'))
