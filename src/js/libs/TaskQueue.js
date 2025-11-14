export class TaskQueue {
	constructor() {
		this.queues = new Map();
	}

	/**
	 * Adds a new asynchronous task to the queue associated with the given key.
	 *
	 * Tasks that share the same key are guaranteed to run sequentially:
	 * each task will begin only after the previous one has finished,
	 * regardless of whether it resolved or rejected. Tasks under different
	 * keys run independently without blocking each other.
	 *
	 * The behavior of the queue can be customized using the `option` parameter.
	 *
	 * @param {string} key
	 *   A unique identifier for the queue. All tasks added with the same `key`
	 *   are executed in order of insertion.
	 *
	 * @param {Function} fn
	 *   A function representing the task to be executed. It may be asynchronous
	 *   or return a Promise. This function will be executed after all previously
	 *   queued tasks for the same key have completed.
	 *
	 * @param {Object} [option]
	 *   An optional configuration object that controls how the task should behave.
	 *
	 * @param {boolean} [option.cancelIfAlreadyInQueue=false]
	 *   If `true`, the new task will be cancelled immediately when a task for
	 *   the same key is already pending or running. This prevents multiple tasks
	 *   from stacking up. When cancelled, the function `fn` will NOT be executed.
	 *
	 * @param {Function|null} [option.callbackForCancelled=null]
	 *   A callback invoked when the task is cancelled due to
	 *   `cancelIfAlreadyInQueue: true`. If provided, the return value of this
	 *   callback becomes the return value of `add()`. If omitted, `add()` returns
	 *   `undefined` when the task is cancelled.
	 *
	 * @returns {Promise|void|*}
	 *   - Returns a Promise representing the scheduled task when it is accepted.
	 *   - Returns the value of `callbackForCancelled` when the task is cancelled.
	 *   - Returns `undefined` when the task is cancelled without a callback.
	 *
	 *
	 * @example
	 * // Basic usage — queue tasks under the same key
	 * queue.add("email", () => sendEmail());
	 * queue.add("email", () => sendEmailAgain());
	 *
	 * @example
	 * // Cancel new task if one is already queued
	 * queue.add("download", () => startDownload(), {
	 *     cancelIfAlreadyInQueue: true
	 * });
	 *
	 * @example
	 * // Cancel with a callback handler
	 * queue.add("save", () => saveFile(), {
	 *     cancelIfAlreadyInQueue: true,
	 *     callbackForCancelled: () => console.log("Task was skipped")
	 * });
	 *
	 * @example
	 * // Queue tasks under different keys (they run independently)
	 * queue.add("A", () => doA());
	 * queue.add("B", () => doB());
	 */

	add(key, fn, option) {
		// --- sanitize option agar selalu object ---
		const opt = typeof option === "object" && option !== null ? option : {};

		const { cancelIfAlreadyInQueue = false, callbackForCancelled = null } = opt;

		let is_cancelled = false;

		// Ambil previous promise di queue
		const prev = this.queues.get(key);

		// Jika sudah ada dan opsi minta cancel
		if (cancelIfAlreadyInQueue && prev) {
			is_cancelled = true;

			// Eksekusi callback cancelled bila tersedia
			if (typeof callbackForCancelled === "function") {
				return callbackForCancelled();
			}

			return;
		}

		// Jika tidak ada previous → pakai Promise.resolve()
		const base = prev || Promise.resolve();

		// next = jalankan fn setelah prev selesai (meski prev error)
		const next = base.catch(() => {}).then(fn);

		// simpan next sebagai promise aktif untuk key ini
		this.queues.set(key, next);

		// ketika next selesai → hapus queue bila next masih yg aktif
		next.finally(() => {
			if (this.queues.get(key) === next) {
				this.queues.delete(key);
			}
		});

		return next;
	}
}
