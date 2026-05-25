import { getItems } from "../lib/data";
import CatalogoClient from "./CatalogoClient";

export default function CatalogoPage() {
    const menus = getItems("menus") || [];
    const catalogos = getItems("catalogos") || [];

    const negocios = [...menus, ...catalogos];

    return <CatalogoClient negocios={negocios} />;
}