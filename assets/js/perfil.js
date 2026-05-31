import { getName, setName } from './storage.js';

const profileName = document.getElementById('profile-name');
const editBtn = document.querySelector('.btn-outline');
const editCard = document.querySelector('.edit-card');
const editInput = document.getElementById('edit-input');
const saveBtn = document.querySelector('.edit-card .btn-primary');
const cancelBtn = document.querySelector('.edit-card .btn-secondary');

function loadProfileName() {
	const name = getName();
	if (profileName) profileName.textContent = name ? name : 'Aprendiz';
	if (editInput) editInput.value = name ? name : '';
}

function showEdit() {
	if (editCard) {
		editCard.style.display = 'block';
		if (editInput) editInput.focus();
	}
}

function hideEdit() {
	if (editCard) editCard.style.display = 'none';
}

function saveNameHandler() {
	if (!editInput) return;
	const name = editInput.value.trim();
	if (!name) {
		alert('Ingresá un nombre válido.');
		editInput.focus();
		return;
	}
	if (name.length > 30) {
		alert('El nombre no puede tener más de 30 caracteres.');
		editInput.focus();
		return;
	}

	setName(name);
	loadProfileName();
	hideEdit();
}

document.addEventListener('DOMContentLoaded', () => {
	loadProfileName();

	if (editBtn) editBtn.addEventListener('click', showEdit);
	if (saveBtn) saveBtn.addEventListener('click', saveNameHandler);
	if (cancelBtn) cancelBtn.addEventListener('click', (e) => { e.preventDefault(); hideEdit(); });

	if (editInput) {
		editInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') saveNameHandler();
			if (e.key === 'Escape') hideEdit();
		});
	}
});
