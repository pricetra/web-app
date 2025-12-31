import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  GroceryList,
  List,
  ListType,
  LogoutDocument,
  MeDocument,
  PostAuthUserDataDocument,
  User,
} from "graphql-utils";
import { SuspenseFallbackLogo } from "@/components/suspense-fallback";
import { useCookies } from "react-cookie";
import { SiteCookieValues } from "@/lib/cookies";
import { useLazyQuery, useMutation } from "@apollo/client/react";

export type UserListsType = {
  allLists: List[];
  favorites: List;
  watchList: List;
};

export type GroceryListsType = {
  defaultGroceryList: GroceryList;
  groceryLists: GroceryList[];
};

export type UserContextType = {
  loggedIn: boolean;
  loading: boolean;
  user?: User;
  lists?: UserListsType;
  allGroceryLists?: GroceryListsType;
  token?: string;
  updateUser: (updatedUser: User) => void;
  logout: () => Promise<void>;
};

export const UserAuthContext = createContext<UserContextType>(
  {} as UserContextType
);

type UserContextProviderProps = {
  children: ReactNode;
};

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [cookies, , removeCookie] = useCookies<"auth_token", SiteCookieValues>([
    "auth_token",
  ]);
  const jwt = cookies.auth_token;
  const [user, setUser] = useState<User>();
  const [userLists, setUserLists] = useState<UserListsType>();
  const [allGroceryLists, setAllGroceryLists] = useState<GroceryListsType>();
  const [me, { data: meData, error: meError }] = useLazyQuery(MeDocument, {
    fetchPolicy: "no-cache",
  });
  const [getPostAuthUserData, { data: postAuthUserData }] = useLazyQuery(
    PostAuthUserDataDocument,
    {
      fetchPolicy: "no-cache",
    }
  );
  const [logout] = useMutation(LogoutDocument);
  const [loading, setLoading] = useState(true);

  // set loading to false is jwt isn't set
  useEffect(() => {
    if (jwt) return;
    setLoading(false);
  }, [jwt]);

  // remove jwt cookie if me query fails
  useEffect(() => {
    if (!meError) return;
    removeCookie("auth_token");
  }, [meError, removeCookie]);

  // set user anytime me query is updated
  useEffect(() => {
    if (!meData) return;
    setUser(meData.me as User);
  }, [meData]);

  useEffect(() => {
    if (!postAuthUserData?.getAllLists) return;

    const allLists = postAuthUserData.getAllLists as List[];
    setUserLists({
      allLists,
      favorites: allLists.find(({ type }) => type === ListType.Favorites)!,
      watchList: allLists.find(({ type }) => type === ListType.WatchList)!,
    });
  }, [postAuthUserData?.getAllLists]);

  useEffect(() => {
    if (!postAuthUserData?.groceryLists) return;

    const allLists = postAuthUserData.groceryLists as GroceryList[];
    setAllGroceryLists({
      defaultGroceryList: allLists.find((l) => l.default)!,
      groceryLists: allLists,
    });
  }, [postAuthUserData?.groceryLists]);

  // call me query
  useEffect(() => {
    if (!jwt) return;

    const ctx = {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    };
    me({ context: { ...ctx } })
      .then(async ({ data: userData }) => {
        if (!userData) return;

        await getPostAuthUserData();
      })
      .catch(() => removeCookie("auth_token"))
      .finally(() => setLoading(false));
  }, [getPostAuthUserData, jwt, me, removeCookie]);

  if (loading) return <SuspenseFallbackLogo />;

  return (
    <UserAuthContext.Provider
      value={{
        loggedIn: jwt !== undefined && user !== undefined,
        loading,
        token: jwt,
        user,
        lists: userLists ?? {
          allLists: [],
          favorites: {} as List,
          watchList: {} as List,
        },
        allGroceryLists,
        updateUser: (updatedUser) => setUser(updatedUser),
        logout: () =>
          logout()
            .then(({ data, error }) => {
              if (error || !data) return;
              removeCookie("auth_token");
            })
            .catch(() => removeCookie("auth_token"))
            .finally(() => {
              setUser(undefined);
              setUserLists(undefined);
            }),
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export const useAuth = () => useContext(UserAuthContext);
