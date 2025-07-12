import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import { login } from "../api/auth/auth";
import FormattedInput from "../utils/FormattedInput";

const Login = () => {
  const [error, setError] = useState(null);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required(`${t("username")} ${t("required")}`),
    password: Yup.string().required(`${t("password")} ${t("required")}`),
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/50 p-8 rounded-xl shadow-xl w-full max-w-sm border border-gray-200">
        <h2 className="text-center text-[2rem] sm:text-[2.5rem] font-serif font-extrabold tracking-[0.1em] text-yellow-500 uppercase drop-shadow-sm mb-6">
          Le Monde
        </h2>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setError(null);
              const { access_token, user } = await login(
                values.username,
                values.password
              );

              localStorage.setItem("token", access_token);
              localStorage.setItem("user", JSON.stringify(user));
              window.location.href = "/";

              navigate("/", { replace: true });
            } catch (err) {
              setError(err.message || t("access_denied"));
              console.error("❌ Login failed:", err);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors, touched, setFieldValue }) => (
            <Form className="space-y-4">
              <Field name="username">
                {({ field }) => (
                  <FormattedInput
                    {...field}
                    cleanDigits
                    placeholder={t("username")}
                    onChange={(e) =>
                      setFieldValue("username", e.target.value)
                    }
                    error={touched.username && errors.username}
                  />
                )}
              </Field>

              <Field name="password">
                {({ field }) => (
                  <FormattedInput
                    {...field}
                    type="password"
                    placeholder={t("password")}
                    onChange={(e) =>
                      setFieldValue("password", e.target.value)
                    }
                    error={touched.password && errors.password}
                  />
                )}
              </Field>

              {error && (
                <div className="text-sm text-red-600">{error}</div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md transition disabled:opacity-50"
              >
                {isSubmitting ? t("loading") : t("login")}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
