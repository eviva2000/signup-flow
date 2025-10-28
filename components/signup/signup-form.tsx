"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signupFormSchema,
  type SignupFormData,
} from "@/lib/validations/signup";
import { useTranslations, useLocale } from "@/lib/i18n";
import { Input, Button } from "@/components/ui";
import { CountrySelect, ConsentCheckbox } from "@/components/forms";

export interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  isLoading?: boolean;
  onExistingUser?: (email: string) => void;
}

export function SignupForm({
  onSubmit,
  isLoading = false,
  onExistingUser,
}: SignupFormProps) {
  const { t } = useTranslations("signup");
  const { locale } = useLocale();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
  } = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      country: "",
      consents: {
        terms: false,
        privacy: false,
        marketing: false,
      },
    },
    mode: "onBlur", // Real-time validation on blur
  });

  const watchedConsents = watch("consents");

  const handleFormSubmit = async (data: unknown) => {
    try {
      setSubmitError(null);
      // Validate and parse the form data using the schema
      const validatedData = signupFormSchema.parse(data);
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof Error) {
        // Check if it's an existing user error
        if (
          error.message.includes("existing") ||
          error.message.includes("exists")
        ) {
          const validatedData = signupFormSchema.parse(data);
          onExistingUser?.(validatedData.email);
          return;
        }

        // Handle validation errors
        if (error.message.includes("email")) {
          setError("email", {
            type: "server",
            message: t("form.email.error.exists"),
          });
          return;
        }

        setSubmitError(error.message);
      } else {
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const isFormLoading = isLoading || isSubmitting;

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-waitly-neutral-900 mb-2">
          {t("title")}
        </h1>
        <p className="text-waitly-neutral-500">{t("subtitle")}</p>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-6"
        noValidate
      >
        {/* Email Field */}
        <Input
          {...register("email")}
          type="email"
          label={t("form.email.label")}
          placeholder={t("form.email.placeholder")}
          error={errors.email?.message}
          required
          autoComplete="email"
          disabled={isFormLoading}
        />

        {/* First Name Field */}
        <Input
          {...register("firstName")}
          type="text"
          label={t("form.firstName.label")}
          placeholder={t("form.firstName.placeholder")}
          error={errors.firstName?.message}
          required
          autoComplete="given-name"
          disabled={isFormLoading}
        />

        {/* Country Selection */}
        <CountrySelect
          {...register("country")}
          label={t("form.country.label")}
          placeholder={t("form.country.placeholder")}
          error={errors.country?.message}
          locale={locale}
          required
          disabled={isFormLoading}
        />

        {/* Consent Checkboxes */}
        <div className="space-y-4">
          <fieldset>
            <legend className="text-sm font-medium text-waitly-neutral-900 mb-4">
              Consent and Agreements
            </legend>

            {/* Terms & Conditions */}
            <div className="mb-4">
              <ConsentCheckbox
                {...register("consents.terms")}
                type="terms"
                checked={watchedConsents.terms}
                onChange={(e) =>
                  setValue("consents.terms", e.target.checked, {
                    shouldValidate: true,
                  })
                }
                error={errors.consents?.terms?.message}
                disabled={isFormLoading}
              />
            </div>

            {/* Privacy Policy */}
            <div className="mb-4">
              <ConsentCheckbox
                {...register("consents.privacy")}
                type="privacy"
                checked={watchedConsents.privacy}
                onChange={(e) =>
                  setValue("consents.privacy", e.target.checked, {
                    shouldValidate: true,
                  })
                }
                error={errors.consents?.privacy?.message}
                disabled={isFormLoading}
              />
            </div>

            {/* Marketing Consent */}
            <div className="mb-4">
              <ConsentCheckbox
                {...register("consents.marketing")}
                type="marketing"
                checked={watchedConsents.marketing}
                onChange={(e) =>
                  setValue("consents.marketing", e.target.checked, {
                    shouldValidate: true,
                  })
                }
                error={errors.consents?.marketing?.message}
                disabled={isFormLoading}
              />
            </div>
          </fieldset>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div
            role="alert"
            aria-live="polite"
            className="p-4 bg-red-50 border border-red-200 rounded-waitly-md"
          >
            <p className="text-sm text-waitly-error">{submitError}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isFormLoading}
          loadingText="Creating account..."
          disabled={isFormLoading}
          className="w-full"
        >
          {t("actions.submit")}
        </Button>
      </form>
    </div>
  );
}
