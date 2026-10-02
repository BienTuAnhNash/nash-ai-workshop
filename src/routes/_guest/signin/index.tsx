import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { signinSchema, type SigninForm } from '@/schemas/signinSchema'
import { Spinner } from '@/components/ui/spinner'
import { useSignin } from '@/hooks/mutations/auth/useSignin'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'

export const Route = createFileRoute('/_guest/signin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const signinMutation = useSignin()

  const form = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SigninForm) => {
    try {
      await signinMutation.mutateAsync({
        email: data.email,
        password: data.password,
      })

      form.reset()
      toast.success('Signin successful!', { position: 'bottom-left' })

      navigate({ to: '/' })
    } catch (error) {
      console.error('Signin failed:', error)
      toast.error('Signin failed.', { position: 'bottom-left' })
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
          <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
          <CardDescription>Please signin for using the system</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FieldGroup>
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
              If do not have account, please{' '}
              <Link to={ROUTES.SIGN_OUT} className="underline">
                sign up here
              </Link>
            </p>

            <Button type="submit" disabled={signinMutation.isPending}>
              {signinMutation.isPending ? (
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
