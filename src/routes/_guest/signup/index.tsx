import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { Spinner } from '@/components/ui/spinner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { signupSchema, type SignupForm } from '@/schemas/signupSchema'
import { useSignup } from '@/hooks/mutations/auth/useSigninup'
import { ROUTES } from '@/constants/routes'

export const Route = createFileRoute('/_guest/signup/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const signupMutation = useSignup()

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SignupForm) => {
    try {
      await signupMutation.mutate({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      form.reset()
      toast.success('Signup successful!', { position: 'bottom-left' })

      navigate({ to: ROUTES.SIGN_IN })
    } catch (error) {
      console.error('Signup failed:', error)
      toast.error('Signup failed.', { position: 'bottom-left' })
      return
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <div className="flex justify-center h-screen items-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
          <CardDescription>Please signup for using system</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FieldGroup>
              <Field>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter the name"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </Field>

              <Field>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter the email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </Field>

              <Field>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter the password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </Field>
            </FieldGroup>

            <p>
              If you have account, please{' '}
              <Link to={ROUTES.SIGN_IN} className="underline">
                sign in here
              </Link>
            </p>

            <Button type="submit" disabled={signupMutation.isPending}>
              {signupMutation.isPending ? (
                <Spinner className="size-2" />
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
