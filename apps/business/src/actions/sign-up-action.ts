import { createClient } from "@loopearn/supabase/server";
import { actionClient } from "./safe-action";
import { signUpSchema } from "./schema";

export const signUpAction = actionClient
  .schema(signUpSchema)
  .action(
    async ({ parsedInput: { firstName, lastName, companyName, email } }) => {
      const supabase = createClient({
        admin: true,
      });

      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            companyName,
          },
          shouldCreateUser: true,
        },
      });

      return {
        data,
        error,
      };
    },
  );
