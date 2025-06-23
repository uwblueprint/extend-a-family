import { useState, useMemo } from "react";
import { Bookmark } from "../types/UserTypes";
import { CourseUnit, CourseModule } from "../types/CourseTypes";

type GroupedBookmarks = {
  [unitId: string]: {
    unit: CourseUnit;
    modules: {
      [moduleId: string]: {
        module: CourseModule;
        bookmarks: Bookmark[];
      };
    };
  };
};

const useBookmarksFilter = (
  bookmarks: Bookmark[],
  units: CourseUnit[],
  modules: { [unitId: string]: CourseModule[] },
) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  // Get unique unit IDs that have bookmarks
  const unitIdsWithBookmarks = useMemo(() => {
    return bookmarks
      .map((b) => b.unitId)
      .filter((unitId, index, array) => array.indexOf(unitId) === index);
  }, [bookmarks]);

  // Group bookmarks by unit and module
  const groupedBookmarks = useMemo((): GroupedBookmarks => {
    const grouped: GroupedBookmarks = {};

    bookmarks.forEach((bookmark) => {
      const unit = units.find((u) => u.id === bookmark.unitId);
      const unitModules = modules[bookmark.unitId] || [];
      const module = unitModules.find((m) => m.id === bookmark.moduleId);

      if (unit && module) {
        if (!grouped[bookmark.unitId]) {
          grouped[bookmark.unitId] = {
            unit,
            modules: {},
          };
        }

        if (!grouped[bookmark.unitId].modules[bookmark.moduleId]) {
          grouped[bookmark.unitId].modules[bookmark.moduleId] = {
            module,
            bookmarks: [],
          };
        }

        grouped[bookmark.unitId].modules[bookmark.moduleId].bookmarks.push(
          bookmark,
        );
      }
    });

    return grouped;
  }, [bookmarks, units, modules]);

  // Filter bookmarks based on selected unit
  const filteredBookmarks = useMemo(() => {
    if (!selectedUnitId) {
      return groupedBookmarks;
    }

    return {
      [selectedUnitId]: groupedBookmarks[selectedUnitId],
    };
  }, [groupedBookmarks, selectedUnitId]);

  // Get units that have bookmarks
  const unitsWithBookmarks = useMemo(() => {
    return units.filter((unit) => unitIdsWithBookmarks.includes(unit.id));
  }, [units, unitIdsWithBookmarks]);

  const selectUnit = (unitId: string | null) => {
    setSelectedUnitId(unitId);
  };

  const clearSelection = () => {
    setSelectedUnitId(null);
  };

  return {
    selectedUnitId,
    filteredBookmarks,
    unitsWithBookmarks,
    selectUnit,
    clearSelection,
    hasBookmarks: bookmarks.length > 0,
  };
};

export default useBookmarksFilter;
