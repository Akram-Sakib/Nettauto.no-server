import { z } from 'zod';

const createBusinessCustomerZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email(),
    password: z
      .string()
      .min(12, { message: "Minst 12 tegn" })
      .regex(/[a-z]/, { message: "Minst 1 liten bokstav" })
      .regex(/[A-Z]/, { message: "Minst 1 stor bokstav" })
      .regex(/\d/, { message: "Minst 1 tall" })
      .regex(/[!\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/, {
        message: "Minst 1 symbol (!“#$%&‘()*+,-./:;<=>?@[]^_`{|}~)",
      }),
    businessCustomer: z.object({
      contactPerson: z.string({
        required_error: 'Contact Person is required',
      }),
      companyName: z.string({
        required_error: 'Company Name is required',
      }),
      organizationNo: z.string({
        required_error: 'Organization No is required',
      }),
      dateOfBirth: z.coerce.date({
        required_error: 'Date of birth is required',
        invalid_type_error: 'Invalid type for date of birth'
      }),
      emailForNotifications: z
        .string({
          required_error: 'Email For Notifications is required',
        })
        .email(),
      contactNo: z.string({
        required_error: 'Contact number is required',
      }),
      postalNo: z.string({
        required_error: 'Postal No is Required',
      }),
      address: z.string({
        required_error: 'Address is Required',
      }),
      city: z.string({
        required_error: 'City is Required',
      }),
      acceptTerms: z.boolean({
        required_error: 'Accept Terms is Required',
      }),
      auctionsEmail: z.boolean({
        required_error: 'Auctions Email is Required',
      }),
      bidEmail: z.boolean({
        required_error: 'Bid Email is Required',
      }),
      profileImage: z.string().optional(),
    }),
  }),
});

const createPrivateCustomerZodSchema = z.object({
  body:
    z.object({
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email(),
      password: z
        .string()
        .min(12, { message: "Minst 12 tegn" })
        .regex(/[a-z]/, { message: "Minst 1 liten bokstav" })
        .regex(/[A-Z]/, { message: "Minst 1 stor bokstav" })
        .regex(/\d/, { message: "Minst 1 tall" })
        .regex(/[!\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/, {
          message: "Minst 1 symbol (!“#$%&‘()*+,-./:;<=>?@[]^_`{|}~)",
        }),
      privateCustomer: z.object({
        name: z.string({
          required_error: 'Name is required',
        }),
        dateOfBirth: z.coerce.date({
          required_error: 'Date of birth is required',
          invalid_type_error: 'Invalid type for date of birth'
        }),
        emailForNotifications: z
          .string({
            required_error: 'Email For Notifications is required',
          })
          .email(),
        contactNo: z.string({
          required_error: 'Contact number is required',
        }),
        postalNo: z.string({
          required_error: 'Postal No is Required',
        }),
        address: z.string({
          required_error: 'Address is Required',
        }),
        city: z.string({
          required_error: 'City is Required',
        }),
        acceptTerms: z.boolean({
          required_error: 'Accept Terms is Required',
        }),
        auctionsEmail: z.boolean({
          required_error: 'Auctions Email is Required',
        }),
        bidEmail: z.boolean({
          required_error: 'Bid Email is Required',
        }),
        profileImage: z.string().optional(),
      }),
    }),

});


const createAdminZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    admin: z.object({
      name: z.object({
        firstName: z.string({
          required_error: 'First name is required',
        }),
        lastName: z.string({
          required_error: 'Last name is required',
        }),
        middleName: z.string().optional(),
      }),

      dateOfBirth: z.string({
        required_error: 'Date of birth is required',
      }),

      gender: z.string({
        required_error: 'Gender is required',
      }),

      bloodGroup: z.string({
        required_error: 'Blood group is required',
      }),

      email: z
        .string({
          required_error: 'Email is required',
        })
        .email(),

      contactNo: z.string({
        required_error: 'Contact number is required',
      }),

      emergencyContactNo: z.string({
        required_error: 'Emergency contact number is required',
      }),

      presentAddress: z.string({
        required_error: 'Present address is required',
      }),

      permanentAddress: z.string({
        required_error: 'Permanent address is required',
      }),

      managementCar: z.string({
        required_error: 'Management car is required',
      }),

      designation: z.string({
        required_error: 'Designation is required',
      }),
      profileImage: z.string().optional(),
    }),
  }),
});

export const UserValidation = {
  createBusinessCustomerZodSchema,
  createPrivateCustomerZodSchema,
  createAdminZodSchema,
};
