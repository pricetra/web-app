import NavToolIconButton from "@/components/ui/nav-tool-icon-button";
import { useEffect, useState } from "react";
import {
  AddBranchToListDocument,
  Branch,
  BranchList,
  GetAllBranchListsByListIdDocument,
  GetAllListsDocument,
  RemoveBranchFromListDocument,
} from "graphql-utils";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "@/context/user-context";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

export type BranchPageNavTools = {
  branch: Branch;
};

export default function BranchPageNavTools({ branch }: BranchPageNavTools) {
  const { loggedIn, lists } = useAuth();
  const [fav, setFav] = useState<boolean>(false);
  const [favBranchListItem, setFavBranchListItem] = useState<BranchList>();
  const [addBranchToList] = useMutation(AddBranchToListDocument, {
    refetchQueries: [GetAllListsDocument, GetAllBranchListsByListIdDocument],
  });
  const [removeBranchFromList] = useMutation(RemoveBranchFromListDocument, {
    refetchQueries: [GetAllListsDocument, GetAllBranchListsByListIdDocument],
  });

  useEffect(() => {
    if (!lists || !lists.favorites.branchList) return;

    const favBranchList = lists.favorites.branchList.find(
      ({ branchId }) => branchId === branch.id,
    );
    if (!favBranchList) {
      setFav(false);
      setFavBranchListItem(undefined);
      return;
    }
    setFav(true);
    setFavBranchListItem(favBranchList);
  }, [lists, branch]);

  return (
    <>
      <NavToolIconButton
        onClick={() => {
          if (!loggedIn || !lists) return;

          if (fav && favBranchListItem) {
            setFav(false);
            removeBranchFromList({
              variables: {
                branchListId: favBranchListItem.id,
                listId: lists.favorites.id,
              },
            })
              .then(({ data }) => {
                if (!data) return;
                setFavBranchListItem(undefined);
              })
              .catch(() => {
                setFav(true);
              });
          } else {
            setFav(true);
            addBranchToList({
              variables: {
                branchId: branch.id,
                listId: lists.favorites.id,
              },
            })
              .then(({ data }) => {
                if (!data) return;
                setFavBranchListItem(data.addBranchToList);
              })
              .catch(() => {
                setFavBranchListItem(undefined);
                setFav(false);
              });
          }
        }}
        tooltip="Add to favorites"
      >
        {fav ? (
          <AiFillHeart className="text-like" />
        ) : (
          <AiOutlineHeart className="text-like" />
        )}
      </NavToolIconButton>
    </>
  );
}
