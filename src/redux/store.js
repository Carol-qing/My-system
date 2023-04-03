import {legacy_createStore as createStore, combineReducers} from 'redux'
import { CollApsedReducer } from "./reducers/CollapsedReducer";
import { LoadingReducer } from "./reducers/LoadingReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// 持久化
const persistConfig = {
    key: 'xxq',
    storage,
    blacklist: ['LoadingReducer']
}
// combineReducers合并reducers
const reducer = combineReducers({
    CollApsedReducer,
    LoadingReducer
})
const persistreducer = persistReducer(persistConfig, reducer)

const store = createStore(persistreducer);
const persistor = persistStore(store)

export {
    store,
    persistor
}

/*
store.dispatch()

store.subsribe()
*/