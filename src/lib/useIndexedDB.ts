import { useEffect, useState } from "react";
import { openDB, IDBPDatabase } from "idb";
import { OrganizationResponse } from "./response-types";

const useIndexedDB = () => {
	const [db, setDb] = useState<IDBPDatabase | null>(null);

	useEffect(() => {
		const initializeDB = async () => {
			try {
				const database = await openDB("TaskForgeDB", 1, {
					upgrade(db: IDBPDatabase) {
						if (!db.objectStoreNames.contains("organizations")) {
							db.createObjectStore("organizations", { keyPath: "publicId" });
						}
					},
				});
				setDb(database);
			} catch (error) {
				console.error("IndexedDB error:", error);
			}
		};

		initializeDB();
	}, []);

	const addOrganization = async (
		orgData: OrganizationResponse
	): Promise<IDBValidKey | undefined> => {
		if (!db) return undefined;
		return db.add("organizations", orgData);
	};

	const getOrganization = async (
		publicId: string
	): Promise<OrganizationResponse | undefined> => {
		if (!db) return undefined;
		return db.get("organizations", publicId);
	};

	const getAllOrganizations = async (): Promise<
		OrganizationResponse[] | undefined
	> => {
		if (!db) return undefined;
		return db.getAll("organizations");
	};

	return {
		db,
		addOrganization,
		getOrganization,
		getAllOrganizations,
	};
};

export default useIndexedDB;
