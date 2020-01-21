# vuex

##### Vuex 集中式存储管理应用的所有组件状态，并以相应的规则保存状态以可预测的方式发生变化

### 任务分析

> 实现一个插件：声明 Store 类，挂载\$store
>
> > Store 具体实现：
> >
> > > 创建响应式的 state，保存 mutations、actions 和 getters
> > >
> > > 实现 commit 方法，根据用户传入 type 执行对应 mutation
> > >
> > > 实现 dispatch 方法，根据用户传入 type 执行对应 action，同时传递上下文
> > >
> > > 实现 getters，按照 getters 定义对 state 做派生
