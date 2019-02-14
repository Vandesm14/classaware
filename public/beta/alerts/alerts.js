function clearAlert(item) {
	item.className = 'alertClosed';
	setTimeout(function() {clearAlertDisplay(item)}, 300);
}

function clearAlertDisplay(box) {
	box.className = 'alertNone';
}