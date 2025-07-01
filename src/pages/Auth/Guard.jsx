import { Navigate, redirect } from "react-router-dom";

const checks = {
  login: {
    key: 'email',
    redirect: '/'
  },
  form: {
    key: 'formFilled',
    redirect: '/form'
  },
  niche: {
    key: 'nicheDone',
    redirect: '/niche'
  },
  uploadResume: {
    key: 'resumeUploaded',
    redirect: '/uploadresume'
  },
  submitted: {
    key: 'submittedDone',
    redirect: '/submitted'
  },
  loginAdmin: {
    key: 'loggedAdmin',
    redirect: '/'
  }
};

export default function Guard({ children, step }) {
  const rule = checks[step];

  const value = sessionStorage.getItem(rule.key);

  if (!value) {
    return <Navigate to={rule.redirect} />;
  }

  return children; 
}
