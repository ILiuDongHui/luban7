# @luban7/antd-tagnav

A React component for navigation using [Tag](https://ant.design/components/tag/) component of [Ant Design](https://ant.design/).  

And it depends on [UmiJS@^3.1.0](https://umijs.org/) .

## Introduction

[@luban7/antd-tagnav](https://www.npmjs.com/settings/luban7/packages/antd-tagnav) is a React component for navigation using [Tag](https://ant.design/components/tag/) component of [Ant Design](https://ant.design/).  

And it depends on [UmiJS@^3.1.0](https://umijs.org/) .

## Getting Started

### Add TagNav to an Existing Project

```
npm install @luban7/antd-tagnav --save
```
or 
```
yarn add @luban7/antd-tagnav
```

### Use in Layout Component

#### Provider
Use React's Context feature to store navigation data

#### TagNav
Use the data provided by the provider to implement the default Tag navigation component

```
import { Layout } from 'antd';

const { Sider, Header, Content } = Layout;

export default function AppLayout(props) {
  return (
    <Layout>
      <Sider />
      <Layout>
        <Header />
        <Provider>
          <TagNav />
          <Content>
            {props.children}
          </Content>
        </Provider>
      </Layout>
    </Layout>
  )
}
```

### Use in Page Component

#### Use TagNavItem Component
```
export default function HomePage() {
  return (
    <TagNavItem title="Home" pin closable={false}>
      <div>
        <h1>Home Page</h1>
      </div>
    </TagNavItem>
  );
}
```

#### Use React HOOK `useTagNavItem(props)`
```
export default function HomePage() {
  useTagNavItem({
    title: 'Home',
    pin: true,
    closable: false,
  });
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}
```

#### Use React HOC `withTagNavItem(props)(Component)`
```
function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}

export default withTagNavItem({
  title: 'Home',
  pin: true,
  closable: false,
})(HomePage);
```

## LICENSE

MIT
