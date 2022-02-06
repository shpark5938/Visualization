import Dashboard from "@/pages/Dashboard.vue";
import EditProfileForm from "@/pages/EditProfileForm";
import WordCount from "@/pages/WordCount";
const routes = [
  {
    path: "/",
    name: "EditProfileForm",
    component: EditProfileForm
  },
  {
    path: "/user",
    name: "Dashboard",
    component: Dashboard
    // props: true
  },
  {
    path: "/wordCount",
    name: "WordCount",
    component: WordCount
    // props: true
  },
];

export default routes;
