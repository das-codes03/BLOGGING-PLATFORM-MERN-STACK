import axios from "axios";
import { useEffect, useState } from "react";

export default function useBlogSearch(pageno, filterbyuserid) {
	console.log(filterbyuserid);

	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [blogs, setBlogs] = useState([]);

	//If page number changes, the start loading next page
	useEffect(() => {
		setIsLoading(true);
	}, [pageno]);

	//if loading parameter is changed the will load
	useEffect(() => {
		if (!isLoading) return;
		let cancel;
		setIsLoading(true);
		axios
			.get(`http://localhost:3000/api/blogs`, {
				params: {
					pageno: pageno,
					perpage: 10,
					filterbyuserid,
					//sortby
				},
				cancelToken: new axios.CancelToken((c) => (cancel = c)),
			})
			.then((res) => {
				const ids = new Set(blogs.map((b) => b.blogId));
				setHasMore(res.data.hasMore);
				setBlogs((blog) => {
					res.data.blogs.forEach((r) => {
						ids.add(r.blogId);
					});
					//now we have unique ids
					console.log(ids);
					blog = [];
					ids.forEach((i) => {
						let src =
							blogs.find((b) => b.blogId == i) ||
							res.data.blogs.find((b) => b.blogId == i);
						blog.push(src);
					});
					setIsLoading(false);
					return blog;
				});
			})
			.catch(() => {
				setIsLoading(false);
			});

		return () => cancel;
	}, [isLoading]);
	return { blogs, isLoading, hasMore };
}
