// const select1 = document.getElementById("sel1");
// const select2 = document.getElementById("sel2");

// const options1 = document.getElementsByClassName("fromsel1");
// const options2 = document.getElementsByClassName("fromsel2");

// console.log(options1);
// console.log(options2);

// for (option of options1) {
//   console.log("incercam sa-i punem event listener la 1");

//   option.addEventListener("click", (event) => {
//     const selected = event.target;
//     console.log("S-A DAT CLICK LA ELEMENTU");
//     console.log(selected);
//     console.log("din select11");
//     select1.removeChild(option);
//     select2.appendChild(option);
//   });
// }

// for (option of options2) {
//   console.log("incercam sa-i punem event listener la 2");

//   option.addEventListener("click", (event) => {
//     const selected = event.target;
//     console.log("S-A DAT CLICK LA ELEMENTU");
//     console.log(selected);
//     console.log("din select22");
//     select2.removeChild(selected);
//     select1.appendChild(selected);
//   });
// }

const moveItem = (sourceId, targetId) => {
  let source = document.getElementById(sourceId);
  let target = document.getElementById(targetId);
  let selectedOption = source.options[source.selectedIndex];

  if (selectedOption) {
    target.add(selectedOption);
  }
};
