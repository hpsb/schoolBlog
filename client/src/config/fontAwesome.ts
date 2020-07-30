import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPencilAlt, faTrash, faSearch, faThumbsUp,  } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPencilAlt, faTrash, faSearch, faThumbsUp, faGithub);

Vue.component("font-awesome-icon", FontAwesomeIcon);
