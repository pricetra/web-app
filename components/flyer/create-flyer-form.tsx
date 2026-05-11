'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { CreateStorefrontFlyerDocument, type FlyerFormat } from 'graphql-utils';
import { FLYER_FORMAT_OPTIONS } from '@/lib/constants/flyer-formats';
import { Button } from '@/components/ui/button';
import { InputGroup } from '@/components/ui/input-group';

dayjs.extend(utc);

interface CreateFlyerFormProps {
  storeId: number;
  branchId?: number | null;
  onFlyerCreated: (flyerId: string, flyerUID: string, format: FlyerFormat) => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required').max(255, 'Title must be 255 characters or less'),
  description: Yup.string().max(1000, 'Description must be 1000 characters or less'),
  branchId: Yup.number().nullable(),
  format: Yup.string().required('Flyer format is required').oneOf(['standard', 'half-sheet', 'tabloid']),
  startsAt: Yup.date().required('Start date is required').typeError('Start date must be a valid date'),
  expiresAt: Yup.date()
    .required('End date is required')
    .typeError('End date must be a valid date')
    .min(Yup.ref('startsAt'), 'End date must be after start date'),
  flyerStyles: Yup.string().default('{}'),
});

export const CreateFlyerForm: React.FC<CreateFlyerFormProps> = ({ storeId, onFlyerCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createFlyer] = useMutation(CreateStorefrontFlyerDocument, {
    onCompleted: (data) => {
      const flyer = data.createStorefrontFlyer;
      toast.success('Flyer created successfully!');
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(`Failed to create flyer: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const response = await createFlyer({
        variables: {
          input: {
            storeId: Number(storeId),
            branchId: values.branchId ? Number(values.branchId) : null,
            title: values.title,
            description: values.description || null,
            flyerStyles: values.flyerStyles || '{}',
            startsAt: dayjs(values.startsAt).utc().toISOString(),
            expiresAt: dayjs(values.expiresAt).utc().toISOString(),
          },
        },
      });
      
      if (response.data) {
        const flyer = response.data.createStorefrontFlyer;
        onFlyerCreated(flyer.id, flyer.uid, values.format);
      }
    } catch (error) {
      console.error('Error creating flyer:', error);
    }
  };

  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');

  return (
    <Formik
      initialValues={{
        title: '',
        description: '',
        branchId: null,
        format: 'standard',
        startsAt: tomorrow,
        expiresAt: dayjs().add(7, 'days').format('YYYY-MM-DD'),
        flyerStyles: '{}',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isValid, errors, touched }) => (
        <Form className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Flyer Title</label>
            <Field
              as={InputGroup}
              name="title"
              placeholder="e.g., Spring Sale 2024"
              disabled={isSubmitting}
            />
            <ErrorMessage name="title" component="p" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Field
              as="textarea"
              name="description"
              placeholder="Optional description for your flyer"
              disabled={isSubmitting}
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="description" component="p" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Branch Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Branch (Optional)</label>
            <Field
              as="select"
              name="branchId"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Store-wide</option>
              {/* TODO: Populate with branches from store */}
            </Field>
            <ErrorMessage name="branchId" component="p" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Flyer Format */}
          <div>
            <label className="block text-sm font-medium mb-2">Flyer Format</label>
            <Field
              as="select"
              name="format"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FLYER_FORMAT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage name="format" component="p" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <Field
              type="date"
              name="startsAt"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="startsAt" component="p" className="text-red-500 text-sm mt-1" />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <Field
              type="date"
              name="expiresAt"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="expiresAt" component="p" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full"
          >
            {isSubmitting ? 'Creating Flyer...' : 'Create Flyer'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
