import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import BKHome from '@/pages/backend/BKHome'
import MyInfo from '@/pages/backend/MyInfo'
import frontend from '@/pages/frontend'
import bristlegrass from '@/pages/backend'
import Login from '@/pages/login'
import BKAnInfo from '@/pages/backend/versionManager/BKAnInfo'
import BKAnAdd from '@/pages/backend/versionManager/BKAnAdd'
import BKIosInfo from '@/pages/backend/versionManager/BKIosInfo'
import BKIosAdd from '@/pages/backend/versionManager/BKIosAdd'
import BKProject from '@/pages/backend/projectManager/project'
import ProjectIndex from '@/pages/backend/projectManager/projectIndex'
/* import myTasks from '@/pages/backend/projectManager/myTasks' */
import allTasks from '@/pages/backend/projectManager/allTasks'
import WorkTime from '@/pages/backend/projectManager/worktime'
import DataIntro from '@/pages/backend/projectManager/dataIntro'
import theProject from '@/pages/backend/projectManager/theProject'
import dataVision from '@/pages/backend/projectManager/dataVision'
import file from '@/pages/backend/projectManager/file'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/front',
      name: 'frontend',
      component: frontend,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/bristlegrass',
      name: '',
      component: bristlegrass,
      children: [
        {
          path: '/',
          name: 'backHome',
          component: BKHome,
          meta: {
            needLogin: true
          }
        },
        {
          path: 'my',
          name: 'my',
          component: MyInfo,
          meta: {
            needLogin: true
          }
        },
        {
          path: 'dataVision',
          name: 'dataVision',
          component: dataVision,
          meta: {
            needLogin: true
          }
        },
        {
          path: 'projects',
          name: 'projects',
          component: BKProject,
          meta: {
            needLogin: true
          }
        },
        {
          path: 'project',
          name: '',
          component: ProjectIndex,
          meta: {
            needLogin: true
          },
          children: [
            /* {
              path: '/',
              name: 'myTasks',
              component: myTasks,
              meta: {
                needLogin: true
              }
            }, */
            {
              path: '/',
              name: 'allTasks',
              component: allTasks,
              meta: {
                needLogin: true
              }
            },
            {
              path: 'WorkTime',
              name: 'WorkTime',
              component: WorkTime,
              meta: {
                needLogin: true
              }
            },
            {
              path: 'theProject',
              name: 'theProject',
              component: theProject,
              meta: {
                needLogin: true
              }
            },
            {
              path: 'dataintro',
              name: 'dataintro',
              component: DataIntro,
              meta: {
                needLogin: true
              }
            },
            {
              path: 'file',
              name: 'file',
              component: file,
              meta: {
                needLogin: true
              }
            }
          ]
        },
        {
          path: 'aninfo',
          name: 'aninfo',
          component: BKAnInfo,
          meta: {
            needLogin: true
          }
        },
        {
          path: 'anadd',
          name: 'anadd',
          component: BKAnAdd,
          meta: {
            needLogin: true
          }
        },
        {
          path: 'iosinfo',
          name: 'iosinfo',
          component: BKIosInfo,
          meta: {
            needLogin: true
          }
        },
        {
          path: 'iosadd',
          name: 'iosadd',
          component: BKIosAdd,
          meta: {
            needLogin: true
          }
        }
      ],
      meta: {
        needLogin: true
      }
    }
  ]
})
