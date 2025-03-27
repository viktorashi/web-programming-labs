const moveItem = (sourceId, targetId) => {
  let source = $(`#${sourceId}`)[0];
  let target = $(`#${targetId}`)[0];
  console.log(source);
  console.log(target);
  let selectedOption = source.options[source.selectedIndex];

  if (selectedOption) {
    target.add(selectedOption);
  }
};

$("#sel1").on("dblclick", () => moveItem("sel1", "sel2"));
$("#sel2").on("dblclick", () => moveItem("sel2", "sel1"));
