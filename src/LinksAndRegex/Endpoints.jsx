import LINK from "./BackendLink"

const URLS={
  DOWNLOAD_ALL:`${LINK}/downloadAll`,
  SEND_EMAIL:`${LINK}/sendemail`,
  UPLOADS:`${LINK}/uploads`,
  LOGIN:`${LINK}/login`,
  SIGNUP:`${LINK}/signup`,
  SAVE_NICHE:`${LINK}/saveNiche`,
  SUBMIT_FORM:`${LINK}/submitForm`,
  GET_NAME_EMAIL:`${LINK}/getNameAndEmail`,
  SEARCH_USER:`${LINK}/searchUser`,
  FETCH_RECIEVED:`${LINK}/fetchRecieved`,
  SHORTLIST:`${LINK}/shortlistCnds`,
  DELETE_CAND:`${LINK}/deleteCandidate`,
  FETCH_SHORTLISTED:`${LINK}/fetchShortlisted`,
  DELETE_ALL:`${LINK}/deleteAll`,
  FETCH_COUNT:`${LINK}/getPages`,
  PAGINATION:`${LINK}/pagination`
};

export default URLS;