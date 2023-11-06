import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

// routes config
import routes from '../routes'
import { getCookie } from "/src/utiles/cookie";
import AuthRoute from '@/auth/AuthRoute.js'

const AppContent = (props) => {
  let role = props.role
  const token = getCookie("ohbyul");

  return (
    <Switch>
      {
        routes.menu.map((route, idx) => {
          const authenticated = (route.auth === 'AUTH' && !token) || (route.auth === 'NA' && token) ? false : true
          return (
            route.component && (
              <AuthRoute
                key={idx}
                authenticated={authenticated}
                path={route.path}
                exact={route.exact}
                name={route.name}
                redirect={route.auth === 'NA' ? '/' : '/login'}
                render={(prop) => {
                  return <route.component {...prop} funcAlertMsg={props.funcAlertMsg} toastSuccess={props.toastSuccess} />
                }}
              />
            )
          )
        })}
      <Redirect from="/" to="/" />
    </Switch>
  )
}

export default React.memo(AppContent)
