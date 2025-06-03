import "./index.css";
import { resetValidation, disableButton, settings, enableValidation } from '../scripts/validation.js';
import headerSrc from "../images/logo.svg";
import profileSrc from "../images/avatar.jpg";
import editIconSrc from "../images/button_secondary.svg";
import plusIconSrc from "../images/plus_icon.svg";
import closeIconSrc from "../images/x_icon.svg";
import addCardIconSrc from "../images/x_icon.svg";
import deleteCardIconSrc from "../images/x_icon_light.svg";
import editProfileAvatarIconSrc from "../images/pencil_icon_white.svg";
import Api from "../utils/Api.js";
import { data } from "autoprefixer";
import { setButtonText } from "../utils/helpers.js";

const initialCards = [
  {
    name: 'Val Thorens',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg',
  },

  {
    name: 'Restaurant terrace',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg',
  },

  {
    name: 'An outdoor cafe',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg',
  },

  {
    name: 'A very long bridge, over the forest and through the trees',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg',
  },

  {
    name: 'Tunnel with morning light',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg',
  },

  {
    name: 'Mountain house',
    link: 'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg',
  },
  {
    name: 'Golden Gate Bridge',
    link: ' https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg',
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "3d995938-1914-4698-b6a4-3b289f1d74f1",
    "Content-Type": "application/json"
  }
});

const avatarImageSrc = document.getElementById("profile-avatar");


// destructure the second item in the callback of the .then
api.getAppInfo().then(([cards, userInfo]) => {

  console.log(cards);
  cards.forEach((item, i, arr) => {
    const cardElement = getCardElement(item);
    cardsList.prepend(cardElement);
  });

  // handle the user's information
  // - set the src of the avatar image
  //set the textContent of both of the text elements
  console.log(userInfo);

  avatarImageSrc.src = userInfo.avatar;
  profileName.textContent = userInfo.name;
  profileDescription.textContent = userInfo.about;

})
  .catch((err) => {
    console.error(err);
  });

//Profile elements
const profileEditbutton = document.querySelector('.profile__edit-btn');
const profileAddbutton = document.querySelector('.profile__add-btn');
const avatarModalBtn = document.querySelector('.profile__avatar-btn');
const profileName = document.querySelector('.profile__name');
const profileDescription = document.querySelector('.profile__description');

// Form elements
const editModal = document.querySelector('#edit-modal');
const editFormElement = editModal.querySelector('.modal__form');
const editModalCloseBtn = editModal.querySelector('.modal__close-btn');
const editModalNameInput = editModal.querySelector('#profile-name-input');
const editModalDescriptionInput = editModal.querySelector(
  '#profile-description-input'
);

// Card Modal elements
const cardModal = document.querySelector('#add-card-modal');
const cardForm = cardModal.querySelector('.modal__form');
const cardSubmitBtn = cardModal.querySelector('.modal__submit-btn');
const cardNameInput = cardModal.querySelector('#add-card-name-input');
const cardLinkInput = cardModal.querySelector('#add-card-link-input');
const cardModalCloseBtn = cardModal.querySelector('.modal__close-btn');

// Preview Modal elements
const previewModal = document.querySelector('#preview-modal');
const previewModalImageEl = previewModal.querySelector('.modal__image');
const previewModalCaptionEl = previewModal.querySelector('.modal__caption');
const previewModalCloseBtn = previewModal.querySelector('.modal__close-btn');

//Card related elements
const cardTemplate = document.querySelector('#card-template');
const cardsList = document.querySelector('.cards__list');

// select the avatar modal and its elements
const avatarModal = document.querySelector('#avatar-modal');
const avatarForm = avatarModal.querySelector('.modal__form');
const avatarSubmitBtn = avatarModal.querySelector('.modal__submit-btn');
const avatarModalCloseBtn = avatarModal.querySelector('.modal__close-btn');
const avatarInput = avatarModal.querySelector('#profile-avatar-input');

// Delete Modal elements
const deleteModal = document.querySelector('#delete-modal');
const deleteForm = deleteModal.querySelector('.modal__form');
const deleteModalCancelBtn = deleteModal.querySelector('#delete-cancel-btn');
let selectedCard;
let selectedCardId;

function openModal(modal) {
  modal.classList.add('modal_opened');
  document.addEventListener('keydown', handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove('modal_opened');
  document.removeEventListener('keydown', handleEscapeKey);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  // editModalSubmitBtn.textContent = 'Saving...';
  // change text content to "Saving..."
  const editModalSubmitBtn = evt.submitter;
  editModalSubmitBtn.textContent = 'Saving...';

  setButtonText(editModalSubmitBtn, true, "Save", "Saving...");
  // disable the button
  api.editUserInfo({ name: editModalNameInput.value, about: editModalDescriptionInput.value })
    .then((data) => {
      console.log(data);
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {

      // todo - call setButtonText instead
      editModalSubmitBtn.textContent = "Save";
    });
}

// todo - implement loading text for all other form submissions

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();

  const addCardModalSubmitBtn = evt.submitter;
  addCardModalSubmitBtn.textContent = 'Saving...';
  setButtonText(addCardModalSubmitBtn, true, "Save", "Saving...");

  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  api
    .addCard(inputValues)
    .then((data) => {
      console.log(data);

      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      evt.target.reset();
    }).catch(console.error)
    .finally(() => {

      addCardModalSubmitBtn.textContent = "Save";
    });
  disableButton(cardSubmitBtn, settings);
  closeModal(cardModal);

}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const avatarSubmitBtn = evt.submitter;

  setButtonText(avatarSubmitBtn, true, "Save", "Saving...");

  console.log(avatarInput.value);
  // const formData = new FormData(avatarForm);
  // const avatarUrl = formData.get('profile-avatar-input');
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      console.log(data);
      // const avatarImageSrc = document.getElementById("profile-avatar");
      avatarImageSrc.src = data.avatar;
      closeModal(avatarModal);
      evt.target.reset();
  disableButton(avatarSubmitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {

      setButtonText(editModalSubmitBtn,false);
    });
  
}


function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const deleteFormSubmitBtn = evt.submitter;
  setButtonText(deleteFormSubmitBtn, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {

      setButtonText(deleteFormSubmitBtn, false, "Delete", "Deleting...");
    });
}


function handleLike(btn, id) {
  // evt.preventDefault();
  //   cardLikeBtn.addEventListener('click', (evt) => {
  //   handleLike(evt, data._id);
  // });

  const isLiked = btn.classList.contains('card__like-btn_liked');
  changeLikeState(btn, id, isLiked);
}
function changeLikeState(btn, id, isLiked) {
  api.handleLike(id, isLiked)
    .then((data) => {
      btn.classList.toggle('card__like-btn_liked', data.isLiked);
    }
    )
    .catch(console.error);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector('.card')
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector('.card__title');
  const cardImageEl = cardElement.querySelector('.card__image');
  const cardLikeBtn = cardElement.querySelector('.card__like-btn');

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeBtn.addEventListener('click', () => {
    // cardLikeBtn.classList.toggle('card__like-btn_liked');
    handleLike(cardLikeBtn, data._id);
  });

  cardImageEl.addEventListener('click', () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });
  const cardDeleteBtn = cardElement.querySelector('.card__delete-btn');
  cardDeleteBtn.addEventListener('click', (evt) => {
    handleCardDelete(cardElement, data);
  });

  if (data.isLiked) {
    cardLikeBtn.classList.add('card__like-btn_liked');
  }
  function handleCardDelete(cardElement, cardId) {
    selectedCard = cardElement;
    selectedCardId = cardId;
    openModal(deleteModal);
  }

  return cardElement;
}

const deleteModalCloseBtn = deleteModal.querySelector('.modal__close-btn');
// Image Elements
const headerImageSrc = document.getElementById("header-logo");
headerImageSrc.src = headerSrc;
// const avatarImageSrc = document.getElementById("profile-avatar");
// avatarImageSrc.src = profileSrc;
const editProfileIconSrc = document.getElementById("edit-profile-icon");
editProfileIconSrc.src = editIconSrc;
const addCardIcon = document.getElementById("add-card-icon");
addCardIcon.src = plusIconSrc;
const closeModalIconSrc = document.getElementById("edit-modal-close-icon");
closeModalIconSrc.src = closeIconSrc;
const addCardModalCloseIconSrc = document.getElementById("add-card-modal-close-icon");
addCardModalCloseIconSrc.src = closeIconSrc;
const editProfileAvatarIcon = document.getElementById("profile-avatar-edit-icon");
editProfileAvatarIcon.src = editProfileAvatarIconSrc;
const deleteCardIcon = document.getElementById("delete-modal-close-btn");
deleteCardIcon.src = deleteCardIconSrc;
profileEditbutton.addEventListener('click', () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(editFormElement, editModalNameInput, editModalDescriptionInput);
  openModal(editModal);
});

editModalCloseBtn.addEventListener('click', () => {
  closeModal(editModal);
});

profileAddbutton.addEventListener('click', () => {
  openModal(cardModal);
});
cardModalCloseBtn.addEventListener('click', () => {
  closeModal(cardModal);
});

previewModalCloseBtn.addEventListener('click', () => {
  closeModal(previewModal);
});

// add event listener to the avatar image to open the modal
avatarModalBtn.addEventListener('click', () => {
  openModal(avatarModal);
});
avatarModalCloseBtn.addEventListener('click', () => {
  closeModal(avatarModal);
}
);

deleteModalCloseBtn.addEventListener('click', () => {
  closeModal(deleteModal);
}
);

deleteModalCancelBtn.addEventListener('click', () => {
  closeModal(deleteModal);
}
);

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener('submit', handleDeleteSubmit);


editFormElement.addEventListener('submit', handleEditFormSubmit);
cardForm.addEventListener('submit', handleAddCardFormSubmit);
/*for (let i = 0; i < initialCards.length; i++) {
  const cardElement = getCardElement(initialCards[i]);
  cardsList.prepend(cardElement);
} */

// initialCards.forEach((item, i, arr) => {
//   const cardElement = getCardElement(item);
//   cardsList.prepend(cardElement);
// });

function handleOverlayClick(evt) {
  if (evt.target.classList.contains('modal_opened')) {
    closeModal(evt.target);
  }
}

document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('mousedown', handleOverlayClick);
});

function handleEscapeKey(evt) {
  if (evt.key === 'Escape') {
    const openedModal = document.querySelector('.modal_opened');
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}


enableValidation(settings);