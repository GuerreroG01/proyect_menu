import { getItems } from "../lib/data";
import CatalogoClient from "./CatalogoClient";

export default function CatalogoPage() {
    const menus = getItems("menus") || [];
    const catalogos = getItems("catalogos") || [];
    const tiendas = getItems("tiendas") || [];
    const negocios = [...menus, ...catalogos, ...tiendas];

    return <CatalogoClient negocios={negocios} />;
}